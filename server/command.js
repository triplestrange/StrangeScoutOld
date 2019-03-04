#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const server = require('./main');

if (process.env.SNAP !== undefined) {
	// we don't want path options if in a snap
	program
		.option('-d, --domain [domain]', 'Domain to host StrangeScout on (required)')
		.option('-p, --port [port]', 'Port to host on', '80')
		.parse(process.argv);

	if (process.getuid() === 0) {
		// if root set db path to SNAP_COMMON dir
		program.path = path.join(process.env.SNAP_COMMON, 'dbs/');
	} else {
		// else set path to SNAP_USER_COMMON dir
		program.path = path.join(process.env.SNAP_USER_COMMON, 'dbs/');
	}

} else {
	program
		.option('-d, --domain [domain]', 'Domain to host StrangeScout on (required)')
		.option('-p, --port [port]', 'Port to host on', '80')
		.option('-P, --path [directory]', 'Directory to store database and config files in', '<program_path>/dbs/')
		.parse(process.argv);
}

// define host domain
const domain = program.domain;
if (domain !== undefined && domain !== '') {
	console.log(`Hosting StrangeScout on ${domain}`);
} else {
	console.log('ERROR: No domain set!');
	program.outputHelp();
	process.exit(1);
}

const port = program.port;

let datadir = '';
if (program.path === '<program_path>/dbs/') {
	if (process.env.SNAP !== undefined) {
		if (process.getuid() === 0) {
			datadir = path.join(process.env.SNAP_COMMON, 'dbs/');
		} else {
			datadir = path.join(process.env.SNAP_USER_COMMON, 'dbs/');
		}
	} else {
		datadir = path.join(__dirname, 'dbs/');
	}
} else {
	datadir = program.path;
}

server(domain, port, datadir);
