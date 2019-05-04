import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Link } from "react-router-dom";

const styles = {};

function Scout(props) {
	const { classes } = props;

	return (
		<div>
			<Link to="/">Test</Link>
		</div>
	);
}

Scout.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scout);