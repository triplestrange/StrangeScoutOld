import React from 'react';

import { CookiesProvider } from 'react-cookie';

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import posed, { PoseGroup } from 'react-pose';

import './App.css';

import Bar from './Bar';
import HomeCard from './Splash';
import Scout from './Scout';

const RoutesContainer = posed.div({
	enter: { x: 0, opacity: 1 },
	exit: { x: 75, opacity: 0 }
});

function App() {
	return (
		<React.Fragment>
			{/** Component allowing access to cookie functions */}
			<CookiesProvider>
				<div className="App">
					{/** React Router */}
					<Router>
						{/** Toolbar */}
						<Bar />
						{/** Router rendering route */}
						<Route render={({ location }) => (
							<React.Fragment>
								{/** Pose Group for animations */}
								<PoseGroup>
									<RoutesContainer key={location.pathname}>
										<Switch location={location}>
											{/** defined routes */}
											<Route path="/" exact component={HomeCard} key="home" />
											<Route path="/scout" exact component={Scout} key="scout" />
										</Switch>
									</RoutesContainer>
								</PoseGroup>
							</React.Fragment>
						)}/>
					</Router>
				</div>
			</CookiesProvider>
		</React.Fragment>
	);
}

export default App;
