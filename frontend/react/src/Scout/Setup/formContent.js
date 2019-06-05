import React from "react";

import { withStyles } from '@material-ui/core/styles';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const styles = {
	field: {
		marginBottom: 15
	}
}

function SetupFormContent(props) {

	const { classes } = props;

	// set props of the setup form
	const {
		values: { team, match },
		errors,
		touched,
		handleSubmit,
		handleChange,
		isValid,
		setFieldTouched
	} = props;

	// change event function
	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField
			id="team"
			name="team"
			label="Team Number"
			type="number"
			className={classes.field}
			fullWidth

			min={1}

			helperText={touched.team ? errors.team : ""}
			error={touched.team && Boolean(errors.team)}
			value={team}
			onChange={change.bind(null, "team")}
			/>

			<TextField
			id="match"
			name="match"
			label="Match Number"
			type="number"
			className={classes.field}
			fullWidth

			min={1}

			helperText={touched.match ? errors.match : ""}
			error={touched.match && Boolean(errors.match)}
			value={match}
			onChange={change.bind(null, "match")}
			/>

			<Button
			type="submit"
			fullWidth
			variant="raised"
			color="primary"
			style={{marginTop: 15}}
			disabled={!isValid}
			>
				Submit
			</Button>
		</form>
	);
};

export default withStyles(styles)(SetupFormContent);