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

	const { submitFunction } = props;

	let submit = submitFunction ? submitFunction : defaultSubmit;

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