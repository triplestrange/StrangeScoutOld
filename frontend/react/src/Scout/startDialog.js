import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

function StartDialog(props) {

	const { onClose, open, ...other } = props;

	function handleCancel() {
		onClose(false);
	}
	function handleOk() {
		onClose(true);
	}

	return (
		<Dialog
		disableBackdropClick
		disableEscapeKeyDown
		open={open}
		{...other}
		>
			<DialogContent>
				Click when the match starts!
			</DialogContent>
			<DialogActions style={{marginRight: 7}}>
				<Button onClick={handleCancel} color="primary">
					Cancel
				</Button>
				<Button onClick={handleOk} color="primary">
					Begin Match
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default (StartDialog);