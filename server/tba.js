const https = require('https');

if (!process.env.EVENTCODE) {
	console.error('\x1b[31mERROR:\x1b[0m No event code specified!');
	process.exit(1);
} else if (!process.env.TBAKEY) {
	console.error('\x1b[31mERROR:\x1b[0m No TBA API key specified!');
	process.exit(1);
}

function teamIndex() {
	return new Promise(resolve => {
		const options = {
			host: 'www.thebluealliance.com',
			path: `/api/v3/event/${process.env.EVENTCODE}/teams/simple`,
			headers: {
				'X-TBA-Auth-Key': process.env.TBAKEY
			}
		};

		let req = https.request(options, function(res) {
			// Continuously update stream with data
			let body = '';
			res.on('data', data => {
				body += data;
			});

			res.on('end', () => {
				const parsed = JSON.parse(body);
				if (!parsed.Errors) {
					final = parsed
						.map(team => team.team_number)
						.sort((a, b) => a - b);;
					resolve(final);
				}
			});
		});

		req.end();
	});
}

teamIndex().then(response => {
	console.log(response);
});