#!/usr/bin/env node

const path = require('path');
const server = require('./main');

const configfile = path.join(process.env.SNAP_COMMON, 'service.conf.json')

const config = require(configfile);

server(config.domain, config.port, path.join(process.env.SNAP_COMMON, 'dbs/'))