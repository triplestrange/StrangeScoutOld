const express = require('express');
const vhost = require('vhost');
const PouchDB = require('pouchdb');
const path = require('path');
const fs = require('fs');

// winston for logging
const winston = require('winston');
const expressWinston = require('express-winston');

// define database prefix
const db = PouchDB.defaults({prefix: path.join(__dirname, 'dbs/')});

// define app
const app = express();
const port = 80;

// define host domain
const domain = process.env.JSCOUT_DOMAIN;
if (domain === undefined || domain === '') {
	console.log('ERROR: No domain set!');
	process.exit(1);
} else {
	console.log(`Hosting StrangeScout on ${domain}`);
}

const DBConf = path.join(__dirname, 'config.json');
const persistDBConf = path.join(__dirname, 'dbs/config.json');

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

// redirect `//` to `/` (fixes bug in pouchdb sync)
app.use((req, res, next) => {
	if (req.url === '//')
		res.redirect(301, '/');
	else
		next();
});

// CORS Headers
app.use((req, res, next) => {
	res.set("Access-Control-Allow-Origin", `https://${domain}`);
	res.set("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
	res.set("Access-Control-Allow-Credentials", "true");
	res.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	next();
});

// static files
const static = express();
static.use(express.static(path.join(__dirname, 'static')));

// pouchdb
const pouch = express();
pouch.use(require('express-pouchdb')(db));

app.use(vhost(`${domain}`, static));
app.use(vhost(`db.${domain}`, pouch));

// listener
app.listen(port, () => console.log(`listening on port ${port}`));
