import React from 'react';
import ReactDOM from 'react-dom';
import HomeCard from './HomeCard';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<HomeCard />, div);
	ReactDOM.unmountComponentAtNode(div);
});
