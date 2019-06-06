import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import '../centerWrapper.css';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import SetupForm from './Setup/form.js';
import StartDialog from './startDialog.js';

import StatusCard from './Scouting/statusCard.js';

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
	// starting values used for timer
	let timer = 0;
	let count = 150;

	// use classes
	const { classes } = props;

	// setup various states
	const [state, setState] = useState({team: 0, match: 0});
	const [view, setView] = useState('setup');
	const [dialogState, setDialogState] = useState(false);
	const [countState, setCountState] = useState(count);

	// define the setup form submit function
	const submit = ({ team, match }) => {
		// set team and match state and open confirm dialog
		setState({team: team, match: match});
		setDialogState(true);
	}

	const onClose = (output) => {
		// close dialog
		setDialogState(false);
		// if dialog was confirmed:
		if (output) {
			// change view
			setView('scout');
			// start countdown timer
			timer = setInterval(countDown, 1000);
		}
	}
	
	// timer function
	const countDown = () => {
		// if interval is set and time is above 0
		if (timer !== 0 && count > 0) {
			// decrement count variable and set counter state
			// counter state is used so React will re-render components
			count = count - 1;
			setCountState(count);
			console.log(`${count}`)
		} else {
			// stop the interval timer when time runs out
			clearInterval(timer);
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
		return (<StatusCard seconds={countState} team={state.team} match={state.match}/>);
	} else {
		return null;
	}
}

export default withStyles(styles)(Scout);