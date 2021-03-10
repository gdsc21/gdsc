import React, { useState } from "react";
import { Home, SignUp, SignIn, Project, Explore, NonProfit, Dev } from "./pages";
import { Switch, Route, Redirect } from "react-router-dom";

const App = () => {
	const [user, setUser] = useState(localStorage.getItem("user"));

	return (
		<Switch>
			<Route path="/dashboard">
				{
					// if the user is logged in and is a developer,
					// then take them to the developer dashboard
					user && user.loggedIn && user.isDev && <Dev />
				}
				{
					// if the user is logged in and isn't a developer (is a non profit),
					// then take them to the non-profit dashboard
					user && user.loggedIn && !user.isDev && <NonProfit />
				}
				{
					// if the user is not logged in, redirect them to the homepage
					(!user || !user.loggedIn) && <Redirect to="/" />
				}
			</Route>
			<Route path="/signup">
				{
					// if the user is logged in,
					// then take them to the dashboard
					user && user.loggedIn && <Redirect to="/dashboard" />
				}
				{
					// if the user is not logged in, redirect them to the homepage
					(!user || !user.loggedIn) && <SignUp />
				}
			</Route>
			<Route path="/signin">
				{
					// if the user is logged in,
					// then take them to the dashboard
					user && user.loggedIn && <Redirect to="/dashboard" />
				}
				{
					// if the user is not logged in, redirect them to the homepage
					(!user || !user.loggedIn) && <SignIn />
				}
			</Route>
			<Route path="/explore">
				{
					// if the user is logged in and is a developer,
					// then take them to the developer dashboard
					user && user.loggedIn && user.isDev && <Explore />
				}
				{
					// if the user is logged in and isn't a developer (is a non profit),
					// then take them to the non-profit dashboard
					user && user.loggedIn && !user.isDev && <Explore />
				}
				{
					// if the user is not logged in, redirect them to the homepage
					(!user || !user.loggedIn) && <Redirect to="/" />
				}
			</Route>
			<Route path="/project/:id">
				<Project />
			</Route>
			<Route path="/">
				<Home />
			</Route>
		</Switch>
	);
};

export default App;
