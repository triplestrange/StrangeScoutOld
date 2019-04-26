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
const dbcontrol = require('./database.js');

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
		// server
		https
		.createServer(serveropts, app)
		.listen(443, () => {
			console.log(`listening on port ${443}`);
			setup(internalip, domain, port, httponly, httpscors, admin, pass);
		}).on('error', (err) => {
			console.log(err);
		});

		// http forwarding to https
		express().get('*', function(req, res) {
			console.log('redirecting HTTP to HTTPS');
			res.redirect(`https://${req.headers.host}${req.url}`);
		})
		.listen(80);
	} else {
		// server
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
			setup(internalip, domain, port, httponly, httpscors, admin, pass);
		}).on('error', (err) => {
			console.log(err);
		});
	}

}

// -------------------------------------

/**
 * initializes the databases
 * @param {string} internalip - internal ip address of server
 * @param {string} domain - domain server is hosted under
 * @param {number} port - port the server is hosted under (used on http only mode)
 * @param {boolean} httponly - if the server is being served with only http
 * @param {boolean} httpscors - if externally the server is accesible via https (such as using a reverse proxy)
 * @param {string} admin - admin username
 * @param {string} pass - admin password
 */
async function setup(internalip, domain, port, httponly, httpscors, admin, pass) {
	let adminParty = await dbcontrol.isAdminParty(internalip, domain, port, httponly, httpscors);

	if (adminParty) {
		console.warn('Database is in admin party mode!\nCreating default admin...');
		await dbcontrol.createDefault(internalip, domain, port, httponly, httpscors, admin, pass);
	}

		dbcontrol.createDB(internalip, domain, port, httponly, httpscors, admin, pass, 'ssdb').then(() => {
			let perms = {
				members: {
					roles:['scouter']
				}
			};
			dbcontrol.dbPerms(internalip, domain, port, httponly, httpscors, admin, pass, 'ssdb', perms);
		});
}

// HEADERS / MIDDLEWARE ----------------

// CORS Headers
function cors(req, res, next) {
	res.set("Access-Control-Allow-Origin", `${req.get('origin')}`);
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
