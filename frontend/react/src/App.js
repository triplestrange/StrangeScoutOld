import React from 'react';

import { CookiesProvider } from 'react-cookie';

import { BrowserRouter as HashRouter, Route, Switch } from "react-router-dom";

import './App.css';

import Bar from './Bar/Bar';
import HomeCard from './HomeCard/HomeCard';
import Scout from './Scout/Scout';

function App() {
	return (
		<CookiesProvider>
			<div className="App">
				<Bar />
				<HashRouter>
					<Switch>
						<Route path="/" exact component={HomeCard} />
						<Route path="/scout" exact component={Scout} />
					</Switch>
				</HashRouter>
			</div>
		</CookiesProvider>
	);
}

export default App;
