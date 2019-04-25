const express = require('express');
const vhost = require('vhost');
const PouchDB = require('pouchdb');
const path = require('path');
const https = require('https');
const http = require('http');
const compression = require('compression');
const fs = require('fs');

// winston for logging
const winston = require('winston');
const expressWinston = require('express-winston');

const tba = require('./tba.js');

let globaldomain = '';
let globalport = 0;
let globalhttps = true;
let globalinternalip = '';

let httpscors = process.env.HTTPSCORS;

/**
 * sets up and runs the StrangeScout server
 * @param {string} domain - domain server is hosted under
 * @param {string} datadir - directory for the server data (databases, etc)
 * @param {boolean} httponly - whether or not to serve only HTTP and no HTTPS
 * @param {number} port - port to serve on if using only HTTP
 * @param {string} keypath - path to TLS key file
 * @param {string} certpath - path to TLS certificate file
 * @param {string} internalip - internal IP address the server is being run on (used for db setup requests)
 * @param {string} admin - admin account
 * @param {string} pass - admin password
 * @param {string} event - event code (optional for TBA integration)
 * @param {string} tbakey - TBA API key (optional for TBA integration)
 */
module.exports = function (domain, datadir, httponly, port, keypath, certpath, internalip, admin, pass, event, tbakey) {
	// set some icky global variables (data is needed in other functions \/)
	globaldomain = domain;
	globalinternalip = internalip;
	if (httponly) {
		globalhttps = false;
	}
	
	// if we're not running as root, throw an error about restricted ports
	if (process.getuid() !== 0) {
		if (!httponly) {
			console.error(`Ports 80 and 443 are restricted to root - \x1b[31myou are not root!\x1b[0m\nTry running with sudo?`);
			process.exit(1);
		} else if (port < 1024) {
			console.error(`Port ${port} is restricted to root - \x1b[31myou are not root!\x1b[0m\nTry running with sudo?`);
			process.exit(1);
		}
	}
	
	// create db data path if it doesn't exist
	if (!fs.existsSync(datadir)) {
		fs.mkdirSync(datadir);
	}
	// change to directory
	process.chdir(datadir);

	// set DB options
	const dbopts = {prefix: `${datadir}/`};
	// define database
	const db = PouchDB.defaults(dbopts);

	let serveropts = {};
	if (!httponly) {
		// read TLS key from file
		let key = '';
		if (fs.existsSync(keypath)) {
			key = fs.readFileSync(keypath);
		} else {
			console.error(`\x1b[31mERROR:\x1b[0m No key file at \`${keypath}\`!`);
			process.exit(1);
		}
		
		// read TLS certificate from file
		let cert = '';
		if (fs.existsSync(certpath)) {
			cert = fs.readFileSync(certpath);
		} else {
			console.error(`\x1b[31mERROR:\x1b[0m No certificate file at \`${certpath}\`!`);
			process.exit(1);
		}

		// set key options
		serveropts = {
			// Private key
			key: key,
			// Fullchain file or cert file (prefer the former)
			cert: cert
		};
	}

	// define app
	const app = express();
	// logging (https://github.com/bithavoc/express-winston#request-logging)
	app.use(expressWinston.logger({
		transports: [
			new winston.transports.Console()
		],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.json(),
			winston.format.timestamp(),
			winston.format.align(),
			winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message} (${info.meta.res.statusCode})`)
		)
	}));

	// use compression
	app.use(compression());

	// static files
	const static = express();
	static.use(express.static(path.join(__dirname, 'static')));
	// pouchdb
	const pouch = express();
	pouch.use(cors);
	pouch.use(noCache);
	pouch.use(require('express-pouchdb')(db));

	app.use(vhost(`${domain}`, static));
	app.use(vhost(`db.${domain}`, pouch));

	console.log(`Hosting StrangeScout on ${domain}`);

	if (!httponly) {
		globalport = 443;
		// server
		https
		.createServer(serveropts, app)
		.listen(443, () => {
			console.log(`listening on port ${443}`);
			setup(admin, pass);
		}).on('error', (err) => {
			console.log(err);
		});

		express().get('*', function(req, res) {
			console.log('redirecting HTTP to HTTPS');
			res.redirect(`https://${req.headers.host}${req.url}`);
		})
		.listen(80);
	} else {
		globalport = port;
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
			setup(admin, pass);
		}).on('error', (err) => {
			console.log(err);
		});
	}

}

/**
 * initializes the databases
 * @param {string} admin - admin username
 * @param {string} pass - admin password
 */
async function setup(admin, pass) {
	let adminParty = await isAdminParty();

	if (adminParty) {
		console.warn('Database is in admin party mode!\nCreating default admin...');
		await createDefault(admin, pass);
	}

		createDB(admin, pass, 'ssdb').then(() => {
			let perms = {
				members: {
					roles:['scouter']
				}
			};
			dbPerms(admin, pass, 'ssdb', perms);
		});
}

// ADMINS ------------------------------

/**
 * checks if the database is in admin party mode
 * @returns {Promise<boolean>} promise resolving boolean for admin party
 */
function isAdminParty() {
	return new Promise(resolve => {
		let method = '';
		let opts = {
			host: globalinternalip,
			path: `/_session`,
			method: 'GET',
			setHost: false,
			headers: {'Host': `db.${globaldomain}`}
		};

		if (globalhttps || httpscors) {
			method = 'https';
		} else {
			method = 'http';
			opts.port = globalport;
		}

		let req = eval(method).request(opts, (res) => {
			// Continuously update stream with data
			let body = '';
			res.on('data', data => {
				body += data;
			});

			// on request end
			res.on('end', () => {
				const parsed = JSON.parse(body);
				if (parsed.userCtx.roles.includes('_admin')) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
		req.end();
	});
}

/**
 * creates a default admin account
 * @param {string} admin - admin username
 * @param {string} pass - admin password
 * @returns {Promise} returns a promise that always resolves true
 */
function createDefault(admin, pass) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
				host: globalinternalip,
				path: `/_node/node1@127.0.0.1/_config/admins/${admin}`,
				method: 'PUT',
				setHost: false,
				headers: {'Host': `db.${globaldomain}`}
		};

		if (globalhttps || httpscors) {
				method = 'https';
		} else {
				method = 'http';
				opts.port = globalport;
		}

		let req = eval(method).request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', () => {});

			res.on('end', () => {
				resolve(true);
			});
		});
		req.write(`"${pass}"`);
		req.end();
	});
}

// DATABASES ---------------------------

/**
 * Creates a database of name `db` using the specified admin username and password
 * @param {string} admin - admin username to use
 * @param {string} pass - admin password to use
 * @param {string} db - database name
 */
function createDB(admin, pass, db) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
			host: globalinternalip,
			path: `/${db}`,
			method: 'PUT',
			setHost: false,
			headers: {'Host': `db.${globaldomain}`, 'Authorization': 'Basic ' + Buffer.from(admin + ':' + pass).toString('base64'), 'Content-Type': 'application/json'}
		};

		if (globalhttps || httpscors) {
			method = 'https';
		} else {
			method = 'http';
			opts.port = globalport;
		}

		let req = eval(method).request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', () => {});

			res.on('end', () => {
				resolve(true);
			});
		});
		req.write(JSON.stringify({id:db,name:db}));
		req.end();
	});
}

/**
 * sets database permissions
 * @param {string} admin - admin username
 * @param {string} pass - admin password
 * @param {string} db - database name
 * @param {string} perms - database `_security` object
 */
function dbPerms(admin, pass, db, perms) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
			host: globalinternalip,
			path: `/${db}/_security`,
			method: 'PUT',
			setHost: false,
			headers: {'Host': `db.${globaldomain}`, 'Authorization': 'Basic ' + Buffer.from(admin + ':' + pass).toString('base64'), 'Content-Type': 'application/json'}
		};

		if (globalhttps || httpscors) {
			method = 'https';
		} else {
			method = 'http';
			opts.port = globalport;
		}

		let req = eval(method).request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', () => {});

			res.on('end', () => {
				resolve(true);
			});
		});
		req.write(JSON.stringify(perms));
		req.end();
	});
}

// HEADERS -----------------------------

// CORS Headers
function cors(req, res, next) {
	if (globalhttps || httpscors === 'true') {
		res.set("Access-Control-Allow-Origin", `https://${globaldomain}`);
	} else {
		res.set("Access-Control-Allow-Origin", `http://${globaldomain}`);
	}
	res.set("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
	res.set("Access-Control-Allow-Credentials", "true");
	res.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
}

// Caching Headers
function noCache(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
}
