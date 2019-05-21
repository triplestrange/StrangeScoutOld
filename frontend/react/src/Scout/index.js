import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SetupForm from './Setup/form.js';


const styles = {
	card: {
		marginTop: 50,

		minWidth: 275,
		maxWidth: 350,
		width: "85%",

		textAlign: "left"
	},
	title: {
		fontSize: 25
	}
};

function Scout(props) {
	const { classes } = props;

	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography className={classes.title} color="textPrimary" gutterBottom>
					Match Setup
					<SetupForm />
				</Typography>
			</CardContent>
		</Card>
	);
}

Scout.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scout);