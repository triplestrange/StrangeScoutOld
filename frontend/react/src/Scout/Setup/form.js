import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import SetupFormContent from './formContent.js'

const validationSchema = Yup.object({
	team: Yup
	.number("Enter the team number")
	.required("Team Number is required")
	.positive("Team Number must be positive")
	.integer("Team Number must be an integer"),

	match: Yup
	.number("Enter the match number")
	.required("Match Number is required")
	.positive("Match Number must be positive")
	.integer("Match Number must be an integer")
});

const defaultSubmit = ({ team, match }) => {
	console.log(team + "::" + match)
}

function SetupForm(props) {

	// pull submit function from props
	const { submitFunction } = props;
	// if submit function exists in props, use it, else use the default submit function
	let submit = submitFunction ? submitFunction : defaultSubmit;
	// default form values
	const values = { team: "", match: "" };

	return (
		<Formik
			render={props => <SetupFormContent {...props} />}
			initialValues={values}
			validationSchema={validationSchema}
			onSubmit={submit}
		/>
	);
};

export default (SetupForm);