#!/usr/bin/env node

var program = require('commander');

const express = require('express');
const vhost = require('vhost');
const PouchDB = require('pouchdb');
const path = require('path');
const fs = require('fs');

// winston for logging
const winston = require('winston');
const expressWinston = require('express-winston');

// define app
const app = express();

program
	.option('-d, --domain [domain]', 'Domain to host StrangeScout on (required)')
	.option('-p, --port [port]', 'Port to host on', '80')
	.option('-P, --path [directory]', 'Directory to store database files in', './dbs/')
	.option('-c, --config [file]', 'File to use for DB configuration', './config.json')
	.parse(process.argv);

// OPTIONS -----------------------------

// set port
const port = program.port;

// define host domain
const domain = program.domain;
if (domain !== undefined && domain !== '') {
	console.log(`Hosting StrangeScout on ${domain}`);
} else {
	console.log('ERROR: No domain set!');
	process.exit(1);
}

let dbopts = {}

// define database prefix
if (program.path === './dbs/') {
	dbopts = {prefix: path.join(__dirname, 'dbs/')};
} else {
	dbopts = {prefix: path.join(program.path)};
}

// define database
const db = PouchDB.defaults(dbopts);

// config file stuff
if (program.config !== './config.json') {
	const DBConf = path.join(__dirname, 'config.json');
	const persistDBConf = path.join(program.config);

	// restore persistent db config file
	if (fs.existsSync(persistDBConf)) {
		console.log('Restoring database config...');
		try {
			fs.copyFileSync(persistDBConf, DBConf);
		} catch(err ){
			console.log(`Error restoring config: ${err.toString()}`);
			process.exit(1);
		}
	} else {
		console.log('No existing database config');
		console.log('Creating new empty config...');
		try {
			fs.writeFileSync(DBConf, '{}');
			try {
				fs.copyFileSync(DBConf, persistDBConf);
			} catch(err ){
				console.log(`Error backing up config: ${err.toString()}`);
				process.exit(1);
			}
		} catch (err) {
			console.log(`Error creating empty config: ${err.toString()}`);
			process.exit(1);
		}
	}

	// watch config file to copy to persistent storage
	fs.watchFile(DBConf, (curr, prev) => {
		//if (event === 'change') {
			console.log('Database config modified');
			if (DBConf) {
				try {
					fs.copyFileSync(DBConf, persistDBConf);
				} catch(err ){
					console.log(`Error backing up config: ${err.toString()}`);
				}
			}
		//}
	});
}

// LOG ---------------------------------

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

// HEADERS -----------------------------

// CORS Headers
function cors(req, res, next) {
	res.set("Access-Control-Allow-Origin", `https://${domain}`);
	res.set("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
	res.set("Access-Control-Allow-Credentials", "true");
	res.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
}

function noCache(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
}

// SERVER ------------------------------

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
