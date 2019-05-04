import React from 'react';
import ReactDOM from 'react-dom';
import Scout from './Scout';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Scout />, div);
	ReactDOM.unmountComponentAtNode(div);
});
