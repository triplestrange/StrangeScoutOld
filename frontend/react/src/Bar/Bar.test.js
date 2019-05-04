import React from 'react';
import ReactDOM from 'react-dom';
import Bar from './bar';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Bar />, div);
	ReactDOM.unmountComponentAtNode(div);
});
