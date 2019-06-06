import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import '../centerWrapper.css';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useCookies } from 'react-cookie';

import { Link } from "react-router-dom";

const styles = {
	card: {
		marginTop: 50,

		minWidth: 275,
		maxWidth: 350,

		textAlign: "center"
	},
	title: {
		fontSize: 25
	},
	button: {
		maxWidth: 190,
		width: "100%",

		margin: 6
	}
};

function HomeCard(props) {
	const { classes } = props;
	const [ cookies ] = useCookies();

	return (
		<div className="wrapper">
			{/** Spash screen card */}
			<Card className={classes.card}>
				<CardContent>
					<Typography className={classes.title} color="textPrimary" gutterBottom>
						{/** Pull the scouters name from the `scouter` cookie */}
						Welcome back {cookies.scouter}!
					</Typography>
					{/** Navigation buttons with a parent link component to go between pages */}
					<Button variant="contained" color="primary" className={classes.button} component={Link} to="/scout">Scout a Match</Button>
					<Button variant="contained" color="primary" className={classes.button}>View Scouting Data</Button>
					{/** TODO - Button that executes a sync function */}
					<Button variant="contained" color="secondary" className={classes.button}>Sync Data</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default withStyles(styles)(HomeCard);