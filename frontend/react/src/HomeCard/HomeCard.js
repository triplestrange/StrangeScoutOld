import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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
		width: "85%",

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
	const [cookies] = useCookies();

	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography className={classes.title} color="textPrimary" gutterBottom>
					Welcome back {cookies.scouter}!
				</Typography>
				<Button variant="contained" color="primary" className={classes.button} component={Link} to="/scout">Scout a Match</Button>
				<Button variant="contained" color="primary" className={classes.button}>View Scouting Data</Button>
				<Button variant="contained" color="secondary" className={classes.button}>Sync Data</Button>
			</CardContent>
		</Card>
	);
}

HomeCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeCard);