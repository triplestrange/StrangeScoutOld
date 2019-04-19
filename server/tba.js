const https = require('https');

function teamIndex() {
	return new Promise(resolve => {
		const options = {
			host: 'www.thebluealliance.com',
			path: '/api/v3/event/2019roe/teams/simple',
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
				final = parsed
					.map(team => team.team_number)
					.sort((a, b) => a - b);;
				resolve(final);
			});
		});

		req.end();
	});
}

teamIndex().then(response => {
	console.log(response);
});