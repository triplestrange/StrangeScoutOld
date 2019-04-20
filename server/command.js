#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const server = require('./main');

program
	.option('-d, --domain [domain]', 'Domain to host StrangeScout on (required)')
	.option('-P, --path [directory]', 'Directory to store database and config files in', '<program_path>/dbs/')
	.option('-i, --internalip [ip]', 'Internal IP address on the server - `127.0.0.1`/`localhost` are invalid (required)')
	.option('-a, --admin [username]', 'Admin account username (required)')
	.option('-s, --password [password]', 'Admin account password (required)')
	.option('-c, --certificate [file]', 'HTTPS certificate file (required if using HTTPS)', '<program_path>/server.crt')
	.option('-k, --key [file]', 'HTTPS key file (required if using HTTPS)', '<program_path>/server.key')
	.option('-o, --httponly', 'Only use HTTP and not HTTPS')
	.option('-p, --port [port]', 'Port to host on (when using http only)', '80')
	.option('-e, --event [event code]', 'TBA event code (required for TBA integration)')
	.option('-t, --tbakey [TBA key]', 'TBA API key (required for TBA integration)')
	.parse(process.argv);

// define host domain
const domain = program.domain;
if (domain === undefined || domain === '') {
	console.error('\x1b[31mERROR:\x1b[0m No domain set!');
	program.outputHelp();
	process.exit(1);
}

let internalip = program.internalip;
if (internalip === undefined || internalip === true) {
	console.error('\x1b[31mERROR:\x1b[0m Internal IP is required!');
	process.exit(1);
}

let admin = program.admin;
if (admin === undefined || admin === true) {
	console.error('\x1b[31mERROR:\x1b[0m Admin username is required!');
	process.exit(1);
}

let pass = program.password;
if (pass === undefined || pass === true) {
	console.error('\x1b[31mERROR:\x1b[0m Admin password is required!');
	process.exit(1);
}

// define cert path
let cert = program.certificate;
if (cert === '<program_path>/server.crt') {
	cert = path.join(__dirname, 'server.crt');
}

// define key path
let key = program.key;
if (key === '<program_path>/server.key') {
	key = path.join(__dirname, 'server.key');
}

const port = program.port;

if (program.httponly === undefined) {
	program.httponly = false;
}

let datadir = program.path;
if (datadir === '<program_path>/dbs/') {
	datadir = path.join(__dirname, 'dbs/');
}

let tbakey = program.tbakey;
let event = program.event;
// XOR on tba key and event code - both are needed if they're used
if ((tbakey === undefined)^(event === undefined)) {
	console.error('\x1b[31mERROR:\x1b[0m Both TBA API Key and Event Code required for TBA integration!');
	process.exit(1);
}
// ensure event code and tba key aren't empty if used
if (tbakey === true) {
	console.error('\x1b[31mERROR:\x1b[0m TBA API Key can\'t be empty!');
	process.exit(1);
} else if (event === true) {
	console.error('\x1b[31mERROR:\x1b[0m Event Code can\'t be empty!');
	process.exit(1);
}

server(domain, datadir, program.httponly, port, key, cert, internalip, admin, pass);
