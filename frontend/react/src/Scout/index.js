import React from 'react';

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

class Scout extends React.Component {
	// starting values used for timer
	timer = 0;
	count = 150;

	constructor(props) {
		super(props);

		// initial state
		this.state = {
			view: 'setup',
			dialog: false,
			count: this.count,
			vars: {
				team: 0,
				match: 0
			}
		};
	}

	// stop timer when the component unmounts
	componentWillUnmount() {
		clearInterval(this.timer)
	}

	render() {
		// pull props and use classes
		const { props } = this;
		const { classes } = props;

		// define the setup form submit function
		const submit = ({ team, match }) => {
			// set team and match state and open confirm dialog
			this.setState({
				dialog: true,
				vars: {
					team: team,
					match: match
				}
			});
		}

		const onClose = (output) => {
			// close dialog
			this.setState({dialog: false});
			// if dialog was confirmed:
			if (output) {
				// change view
				this.setState({view: 'scout'});
				// start countdown timer
				this.timer = setInterval(countDown, 1000);
			}
		}

		// timer function
		const countDown = () => {
			// if interval is set and time is above 0
			if (this.timer !== 0 && this.count > 0) {
				// decrement count variable and set counter state
				// counter state is used so React will re-render components
				this.count = this.count - 1;
				this.setState({count: this.count});
			} else {
				// stop the interval timer when time runs out
				clearInterval(this.timer);
			}
		}

		// define views
		if (this.state.view === 'setup') {
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
					<StartDialog open={this.state.dialog} onClose={onClose}/>
				</div>
			);
		} else if (this.state.view === 'scout') {
			return (
				<StatusCard seconds={this.state.count} team={this.state.vars.team}/>
			);
		} else {
			return (
				<div>
					ERROR: View `{this.view}` is not defined!
				</div>
			);
		}
	}
}

export default withStyles(styles)(Scout);