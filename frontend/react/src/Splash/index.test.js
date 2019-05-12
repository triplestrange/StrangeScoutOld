import React from 'react';
import ReactDOM from 'react-dom';
import HomeCard from '.';

import { HashRouter as Router } from "react-router-dom";

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
		<Router>
			<HomeCard />
		</Router>
	, div);
	ReactDOM.unmountComponentAtNode(div);
});
