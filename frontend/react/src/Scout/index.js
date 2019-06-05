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

	// default state (view set to setup form)
	const [state, setState] = useState({view: 'setup'});

	// define the setup form submit function
	const submit = ({ team, match }) => {
		// change view to scout and set team and match in state
		setState({view: 'scout', team: team, match: match});
	}

	// define views
	if (state.view === 'setup') {
		return (
			<Card className={classes.card}>
				<CardContent>
					<Typography className={classes.title} color="textPrimary" gutterBottom>
						Match Setup
					</Typography>
					<SetupForm submitFunction={submit}/>
				</CardContent>
			</Card>
		);
	} else if (state.view === 'scout') {
		return (<p>{state.team}</p>);
	} else {
		return null;
	}
}

Scout.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scout);