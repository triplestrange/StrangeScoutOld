import React from 'react';

import { CookiesProvider } from 'react-cookie';

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import posed, { PoseGroup } from 'react-pose';

import './App.css';

import Bar from './Bar/Bar';
import HomeCard from './HomeCard/HomeCard';
import Scout from './Scout/Scout';

const RoutesContainer = posed.div({
	enter: { opacity: 1 },
	exit: { opacity: 0 }
});

function App() {
	return (
		<CookiesProvider>
			<div className="App">
				<Bar />
				<Router>
					<Route render={({ location }) => (
						<PoseGroup>
							<RoutesContainer key={location.pathname}>
								<Switch location={location}>
									<Route path="/" exact component={HomeCard} key="home" />
									<Route path="/scout" exact component={Scout} key="scout" />
								</Switch>
							</RoutesContainer>
						</PoseGroup>
					)}/>
				</Router>
			</div>
		</CookiesProvider>
	);
}

export default App;
