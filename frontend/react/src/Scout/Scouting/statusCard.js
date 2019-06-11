import React from "react";
import { withStyles } from "@material-ui/core";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
	card: {
		marginTop: 50,

		minWidth: 300,
		maxWidth: 350,

		textAlign: "center"
	},
	title: {
		fontSize: 25
	},
	info: {
		fontSize: 17
	}
};

function StatusCard(props) {
	// defining props
	let { seconds, team, lastEvent, classes } = props;

	// format seconds into `mm:ss`
	const formatTime = (totalSeconds) => {
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		if (seconds < 10) {
			seconds = `0${seconds}`
		}
		return `${minutes}:${seconds}`;
	}

	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography className={classes.title} color="textPrimary" gutterBottom>
					Remaining Time: {formatTime(seconds)}
				</Typography>
				<Typography className={classes.info} gutterBottom>
					Team: {team}
				</Typography>
				<Typography className={classes.info}>
					Last Event: {lastEvent}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default withStyles(styles)(StatusCard);