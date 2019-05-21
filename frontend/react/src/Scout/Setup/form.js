import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Field } from 'formik';

function SetupForm(props) {
	return (
		<form onSubmit={() => {}}>
			<TextField
			id="team"
			name="team"
			label="Team Number"
			type="number"
			fullWidth
			/>

			<TextField
			id="match"
			name="match"
			label="Match Number"
			type="number"
			fullWidth
			/>

			<Button
			type="submit"
			fullWidth
			variant="raised"
			color="primary"
			style={{marginTop: 20}}
			>
				Submit
			</Button>
		</form>
	);
};

export default (SetupForm);