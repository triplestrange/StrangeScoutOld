import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

	const [view, setView] = useState('setup');

	const submit = ({ team, match }) => {
		setView('scout');
	}

	if (view === 'setup') {
		return (
			<Card className={classes.card}>
				<CardContent>
					<Typography className={classes.title} color="textPrimary" gutterBottom>
						Match Setup
						<SetupForm submitFunction={submit}/>
					</Typography>
				</CardContent>
			</Card>
		);
	} else if (view === 'scout') {
		return null;
	} else {
		return null;
	}
}

Scout.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scout);