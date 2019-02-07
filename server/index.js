const express = require('express');
const PouchDB = require('pouchdb');
const path = require('path');

// winston for logging
const winston = require('winston');
const expressWinston = require('express-winston');

// define database prefix
const db = PouchDB.defaults({prefix: path.join(__dirname, 'dbs/')})

const app = express();
const port = 80;

// listener
app.listen(port, () => console.log(`listening on port ${port}`));

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

// static files at root
app.use('/', express.static(path.join(__dirname, 'static')));
// pouchdb-server
app.use('/db', require('express-pouchdb')(db));
