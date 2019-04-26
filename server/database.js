const https = require('https');
const http = require('http');

// ADMINS ------------------------------

/**
 * checks if the database is in admin party mode
 * @param {string} internalip - internal ip address of server
 * @param {string} domain - domain server is hosted under
 * @param {number} port - port the server is hosted under (used on http only mode)
 * @param {boolean} httponly - if the server is being served with only http
 * @param {boolean} httpscors - if externally the server is accesible via https (such as using a reverse proxy)
 * @returns {Promise<boolean>} promise resolving boolean for admin party
 */
module.exports.isAdminParty = function isAdminParty(internalip, domain, port, httponly, httpscors) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
			host: internalip,
			path: `/_session`,
			method: 'GET',
			setHost: false,
			headers: {'Host': `db.${domain}`}
		};

		if (!httponly || httpscors) {
			method = 'https';
		} else {
			method = 'http';
			opts.port = port;
		}

		let req = eval(method).request(opts, (res) => {
			// Continuously update stream with data
			let body = '';
			res.on('data', data => {
				body += data;
			});

			// on request end
			res.on('end', () => {
				const parsed = JSON.parse(body);
				if (parsed.userCtx.roles.includes('_admin')) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
		req.end();
	});
}

/**
 * creates a default admin account
 * @param {string} internalip - internal ip address of server
 * @param {string} domain - domain server is hosted under
 * @param {number} port - port the server is hosted under (used on http only mode)
 * @param {boolean} httponly - if the server is being served with only http
 * @param {boolean} httpscors - if externally the server is accesible via https (such as using a reverse proxy)
 * @param {string} admin - admin username
 * @param {string} pass - admin password
 * @returns {Promise} returns a promise that always resolves true
 */
module.exports.createDefault = function createDefault(internalip, domain, port, httponly, httpscors, admin, pass) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
				host: internalip,
				path: `/_node/node1@127.0.0.1/_config/admins/${admin}`,
				method: 'PUT',
				setHost: false,
				headers: {'Host': `db.${domain}`}
		};

		if (!httponly || httpscors) {
				method = 'https';
		} else {
				method = 'http';
				opts.port = port;
		}

		let req = eval(method).request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', () => {});

			res.on('end', () => {
				resolve(true);
			});
		});
		req.write(`"${pass}"`);
		req.end();
	});
}

// DATABASES ---------------------------

/**
 * Creates a database of name `db` using the specified admin username and password
 * @param {string} internalip - internal ip address of server
 * @param {string} domain - domain server is hosted under
 * @param {number} port - port the server is hosted under (used on http only mode)
 * @param {boolean} httponly - if the server is being served with only http
 * @param {boolean} httpscors - if externally the server is accesible via https (such as using a reverse proxy)
 * @param {string} admin - admin username to use
 * @param {string} pass - admin password to use
 * @param {string} db - database name
 */
module.exports.createDB = function createDB(internalip, domain, port, httponly, httpscors, admin, pass, db) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
			host: internalip,
			path: `/${db}`,
			method: 'PUT',
			setHost: false,
			headers: {'Host': `db.${domain}`, 'Authorization': 'Basic ' + Buffer.from(admin + ':' + pass).toString('base64'), 'Content-Type': 'application/json'}
		};

		if (!httponly || httpscors) {
			method = 'https';
		} else {
			method = 'http';
			opts.port = port;
		}

		let req = eval(method).request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', () => {});

			res.on('end', () => {
				resolve(true);
			});
		});
		req.write(JSON.stringify({id:db,name:db}));
		req.end();
	});
}

/**
 * sets database permissions
 * @param {string} internalip - internal ip address of server
 * @param {string} domain - domain server is hosted under
 * @param {number} port - port the server is hosted under (used on http only mode)
 * @param {boolean} httponly - if the server is being served with only http
 * @param {boolean} httpscors - if externally the server is accesible via https (such as using a reverse proxy)
 * @param {string} admin - admin username
 * @param {string} pass - admin password
 * @param {string} db - database name
 * @param {string} perms - database `_security` object
 */
module.exports.dbPerms = function dbPerms(internalip, domain, port, httponly, httpscors, admin, pass, db, perms) {
	return new Promise(resolve => {
		let method = '';
		let opts = {
			host: internalip,
			path: `/${db}/_security`,
			method: 'PUT',
			setHost: false,
			headers: {'Host': `db.${domain}`, 'Authorization': 'Basic ' + Buffer.from(admin + ':' + pass).toString('base64'), 'Content-Type': 'application/json'}
		};

		if (!httponly || httpscors) {
			method = 'https';
		} else {
			method = 'http';
			opts.port = port;
		}

		let req = eval(method).request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', () => {});

			res.on('end', () => {
				resolve(true);
			});
		});
		req.write(JSON.stringify(perms));
		req.end();
	});
}