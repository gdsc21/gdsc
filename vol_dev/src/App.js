import React from "react";
import { Home, SignUp, SignIn, Project, Explore, NonProfit, Dev } from "./pages";
import { Switch, Route } from "react-router-dom";

const App = () => {
	return (
		<Switch>
			<Route path="/dashboard">
				<Home />
			</Route>
		</Switch>
	);
};

export default App;
