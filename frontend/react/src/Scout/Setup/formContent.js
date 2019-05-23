import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

function SetupFormContent(props) {

	const {
		values: { team, match },
		errors,
		touched,
		handleSubmit,
		handleChange,
		isValid,
		setFieldTouched
	} = props;

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
			style={{marginTop: 20}}
			disabled={!isValid}
			>
				Submit
			</Button>
		</form>
	);
};

export default (SetupFormContent);