import React from "react";

function StatusCard(props) {
	let { seconds } = props;

	return (
		<div>
			{seconds}
		</div>
	);
}

export default (StatusCard);