const fs = require('fs');
const cmd = require('node-cmd');
const path = require('path');
const inquirer = require('inquirer');

const conffile = path.join(__dirname, 'config.json');

const wd = process.cwd();

/**
 * Main Menu
 */
function mainMenu(callback) {
	inquirer
	.prompt([
		{
			type: 'list',
			name: "selection",
			message: `StrangeScout: ${(status()) ? "Running" : "Stopped"}`,
			choices: [ "Build", "Start", "Stop" ],
			filter: function( val ) { return val.toLowerCase(); }
		}
	])
	.then(answers => {
		callback(answers);
	});
}

/**
 * True if config file exists, else false
 */
function checkConfig() {
	if (fs.existsSync(conffile)) {
		return true
	} else {
		return false
	}
}

/**
 * Returns config options in an object
 */
function readConfig() {
	return JSON.parse(fs.readFileSync(conffile))
}

/**
 * Gets new config options and writes a config file
 */
function newConfig() {
	return new Promise(resolve => {
		inquirer
		.prompt([
			{
				type : 'input',
				name : 'domain',
				message : 'Enter your domain ...'
			},
			{
				type : 'input',
				name : 'network',
				message : 'Enter docker/traefik network ...'
			},
			{
				type : 'input',
				name : 'prefix',
				message : 'Enter image prefix ...'
			}
		])
		.then(answers => {
			fs.writeFile(conffile, JSON.stringify(answers, null, "\t"), 'utf8', function() {
				console.log('Config file written!');
				resolve();
			});
		});
	})
}

/**
 * Returns true if StrangeScout is running, else false
 */
function status() {
	conf = readConfig();
	promise = new Promise(resolve => {
		cmd.get(
		`
		cd ${__dirname}
		COMPOSE_PROJECT_NAME=${conf.prefix} TRAEFIK_NETWORK=${conf.network} PREFIX=${conf.prefix} docker-compose ps | sed '3q;d' | awk '{print $4}'
		cd ${wd}
		`,
		function(err, data, stderr) {
			resolve(data);
		})
	});
	promise.then(result => {
		if (result.includes("Up")) {
			return true;
		} else {
			return false;
		}
	});
	
}

/**
 * Builds StrangeScout
 */
async function build() {
	conf = readConfig();
	console.log('Building StrangeScout - This may take a while...')
	promise = new Promise(resolve => {
		cmd.get(
		`
		cd ${__dirname}
		COMPOSE_PROJECT_NAME=${conf.prefix} TRAEFIK_NETWORK=${conf.network} PREFIX=${conf.prefix} docker-compose down
		COMPOSE_PROJECT_NAME=${conf.prefix} TRAEFIK_NETWORK=${conf.network} PREFIX=${conf.prefix} docker-compose build --build-arg JSCOUT_DOMAIN=${conf.domain}
		COMPOSE_PROJECT_NAME=${conf.prefix} TRAEFIK_NETWORK=${conf.network} PREFIX=${conf.prefix} docker-compose up -d
		cd ${wd}
		`,
		function(err, data, stderr) {
			console.log(data);
			resolve();
		})
	});
	promise.then(() => {console.log('done!')})
}

/**
 * Starts StrangeScout
 */
async function start() {
	conf = readConfig();
	console.log('Starting StrangeScout...')
	promise = new Promise(resolve => {
		cmd.get(
		`
		cd ${__dirname}
		COMPOSE_PROJECT_NAME=${conf.prefix} TRAEFIK_NETWORK=${conf.network} PREFIX=${conf.prefix} docker-compose up -d
		cd ${wd}
		`,
		function(err, data, stderr) {
			console.log(data);
			resolve();
		})
	});
	promise.then(() => {console.log('done!')})
}

/**
 * Stops StrangeScout
 */
async function stop() {
	conf = readConfig();
	console.log('Stopping StrangeScout...')
	promise = new Promise(resolve => {
		cmd.get(
		`
		cd ${__dirname}
		COMPOSE_PROJECT_NAME=${conf.prefix} TRAEFIK_NETWORK=${conf.network} PREFIX=${conf.prefix} docker-compose down
		cd ${wd}
		`,
		function(err, data, stderr) {
			console.log(data);
			resolve();
		})
	});
	promise.then(() => {console.log('done!')})
}

/**************************************/

mainMenu(function(answers) {
	// if we chose to build
	if (answers.selection === "build") {
		// new promise
		promise = new Promise(resolve => {
			// check if a config exists
			if (checkConfig()) {
				// prompt to use existing config or create new one
				inquirer
				.prompt([
					{
						type: "list",
						name: "conf",
						message: "Config File",
						choices: [ "Use existing config", "Create new config" ],
						filter: function( val ) { return val.toLowerCase(); }
					}
				])
				.then(answers => {
					if (answers.conf === "create new config") {
						// if we chose to create a new config
						newConfig().then(() => resolve());
					} else {
						// else resolve and use existing
						resolve();
					}
				});
			} else {
				// if no config exists make a new one
				newConfig().then(() => resolve());
			}
		});
		// run the promise
		promise.then(() => {
			build();
		})
	} else if (answers.selection === "start") {
		start();
	} else if (answers.selection === "stop") {
		stop();
	}
});