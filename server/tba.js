const https = require('https');

/**
 * resolves an array of team numbers at an event
 * @param {string} key - TBA API key for querying data
 * @param {string} event - event code for querying data
 * @returns {Promise<number[]>} promise resolving an array of team numbers (empty if query errors encountered)
 */
module.exports.teamIndex = function teamIndex(key, event) {
	return new Promise(resolve => {
		// set query options
		const options = {
			host: 'www.thebluealliance.com',
			path: `/api/v3/event/${key}/teams/simple`,
			headers: {
				'X-TBA-Auth-Key': event
			}
		};

		// TBA API request
		let req = https.request(options, function(res) {
			// Continuously update stream with data
			let body = '';
			res.on('data', data => {
				body += data;
			});

			// on request end
			res.on('end', () => {
				const parsed = JSON.parse(body);
				// if no errors returned by API
				if (!parsed.Errors && !parsed.Error) {
					// map team numbers to an array and sort ascending
					final = parsed
						.map(team => team.team_number)
						.sort((a, b) => a - b);;
					resolve(final);
				} else {
					resolve([]);
				}
			});
		});

		req.end();
	});
};
