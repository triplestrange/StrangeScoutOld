import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const styles = {
	button: {
		textTransform: "none"
	}
}

function StartDialog(props) {
	// props
	const { classes, onClose, open, ...other } = props;
	// close handlers
	function handleCancel() {
		onClose(false);
	}
	function handleOk() {
		onClose(true);
	}

	return (
		<React.Fragment>
			{/** Dialog - disable exiting - use passed prop to open and close */}
			<Dialog disableBackdropClick disableEscapeKeyDown open={open} {...other}>
				<DialogContent>
					Click when the match starts!
				</DialogContent>
				<DialogActions style={{marginRight: 7}}>
					<Button onClick={handleCancel} className={classes.button}>
						Cancel
					</Button>
					<Button onClick={handleOk} className={classes.button}>
						Begin Match
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

export default withStyles(styles)(StartDialog);