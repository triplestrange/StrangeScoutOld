#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const server = require('./main');

if (process.env.SNAP !== undefined) {
	// we don't want path options if in a snap
	program
		.option('-d, --domain [domain]', 'Domain to host StrangeScout on (required)')
		.option('-o, --httponly', 'Only use HTTP and not HTTPS')
		.option('-p, --port [port]', 'Port to host on (when using http only)', '80')
		.parse(process.argv);

	if (process.getuid() === 0) {
		// if root set db path to SNAP_COMMON dir
		program.path = path.join(process.env.SNAP_COMMON, 'dbs/');
		program.key = path.join(process.env.SNAP_COMMON, 'server.key');
		program.certificate = path.join(process.env.SNAP_COMMON, 'server.crt');
	} else {
		// else set path to SNAP_USER_COMMON dir
		program.path = path.join(process.env.SNAP_USER_COMMON, 'dbs/');
		program.key = path.join(process.env.SNAP_USER_COMMON, 'server.key');
		program.certificate = path.join(process.env.SNAP_USER_COMMON, 'server.crt');
	}

} else {
	program
		.option('-d, --domain [domain]', 'Domain to host StrangeScout on (required)')
		.option('-P, --path [directory]', 'Directory to store database and config files in', '<program_path>/dbs/')
		.option('-c, --certificate [file]', 'HTTPS certificate file (required)', '<program_path>/server.crt')
		.option('-k, --key [file]', 'HTTPS key file (required)', '<program_path>/server.key')
		.option('-o, --httponly', 'Only use HTTP and not HTTPS')
		.option('-p, --port [port]', 'Port to host on (when using http only)', '80')
		.parse(process.argv);
}

// define host domain
const domain = program.domain;
if (domain === undefined || domain === '') {
	console.error('\x1b[31mERROR:\x1b[0m No domain set!');
	program.outputHelp();
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

server(domain, datadir, program.httponly, port, key, cert);
