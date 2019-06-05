import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../centerWrapper.css';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import SetupForm from './Setup/form.js';
import StartDialog from './startDialog.js';

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
	const [state, setState] = useState({team: 0, match: 0});
	const [view, setView] = useState('setup');
	const [dialogState, setDialogState] = useState(false);

	// define the setup form submit function
	const submit = ({ team, match }) => {
		// set team and match state and open confirm dialog
		setState({team: team, match: match});
		setDialogState(true);
	}

	const onClose = (output) => {
		setDialogState(false);
		if (output) {
			setView('scout');
		}
	}

	// define views
	if (view === 'setup') {
		return (
			<div className="wrapper">
				<Card className={classes.card}>
					<CardContent>
						<Typography className={classes.title} color="textPrimary" gutterBottom>
							Match Setup
						</Typography>
						<SetupForm submitFunction={submit} />
					</CardContent>
				</Card>
				<StartDialog open={dialogState} onClose={onClose}/>
			</div>
		);
	} else if (view === 'scout') {
		return (<p>{state.team}</p>);
	} else {
		return null;
	}
}

Scout.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scout);