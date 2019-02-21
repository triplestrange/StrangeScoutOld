const express = require('express');
const vhost = require('vhost');
const PouchDB = require('pouchdb');
const path = require('path');

// winston for logging
const winston = require('winston');
const expressWinston = require('express-winston');

// define database prefix
const db = PouchDB.defaults({prefix: path.join(__dirname, 'dbs/')})

const app = express();
const port = 80;

const domain = process.env.JSCOUT_DOMAIN;
if (domain === undefined || domain === '') {
	console.log('ERROR: No domain set!');
	process.exit(1);
}

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

app.use((req, res, next) => {
	if (req.url === '//')
		res.redirect(301, '/');
	else
		next();
});

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
pouch.use(require('express-pouchdb')(db))

app.use(vhost(`${domain}`, static));
app.use(vhost(`db.${domain}`, pouch));

// listener
app.listen(port, () => console.log(`listening on port ${port}`));
