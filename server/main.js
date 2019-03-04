const express = require('express');
const vhost = require('vhost');
const PouchDB = require('pouchdb');
const path = require('path');
const fs = require('fs');

// winston for logging
const winston = require('winston');
const expressWinston = require('express-winston');

let globaldomain = '';

module.exports = function(domain, port, datadir) {
	globaldomain = domain;
	// create db path if it doesn't exist
	if (!fs.existsSync(datadir)) {
		fs.mkdirSync(datadir);
	}

	process.chdir(datadir);

	// set DB options
	const dbopts = {prefix: datadir};

	// define database
	const db = PouchDB.defaults(dbopts);

	// define app
	const app = express();

	// logging (https://github.com/bithavoc/express-winston#request-logging)
	app.use(expressWinston.logger({
		transports: [
			new winston.transports.Console()
		],
		format: winston.format.combine(
			winston.format.json()
		),
		meta: false,
		msg: "HTTP {{req.method}} {{req.url}} {{req.method}} {{res.responseTime}}ms",
		expressFormat: false
	}));

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

	// listener
	app.listen(port, () => console.log(`listening on port ${port}`));
}

// HEADERS -----------------------------

// CORS Headers
function cors(req, res, next) {
	res.set("Access-Control-Allow-Origin", `https://${globaldomain}`);
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