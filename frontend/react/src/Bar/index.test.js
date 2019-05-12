import React from 'react';
import ReactDOM from 'react-dom';
import Bar from '.';

import { HashRouter as Router } from "react-router-dom";

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
		<Router>
			<Bar />
		</Router>
	, div);
	ReactDOM.unmountComponentAtNode(div);
});
