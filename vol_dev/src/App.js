import React, { useEffect, useState } from "react";
import { Home, SignUp, SignIn, Project, Explore, NonProfit, Dev } from "./pages";
import { Switch, Route, Redirect } from "react-router-dom";
import { fbApp } from "./firebase";
import { getSessionStorageExpire } from "./utils";
import axios from "axios";

const App = () => {
	const [isDev, setDev] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		fbApp.auth().onAuthStateChanged(setUser);
		try {
			setDev(user.providerData[0].providerId === "github.com");
		} catch {}
	}, [user]);

	return (
		<Switch>
			<Route path="/dashboard">
				{
					// if user is logged in and a developer go to Dev if not a developer go to NonProfit
					// if user is not logged in go to home
					// !!user ? isDev ? <Dev /> : <NonProfit /> : <Redirect to="/" />

					// for debugging the dashboard
					<Dev />
				}
			</Route>
			<Route path="/signup">
				{
					// if user is logged in go to dashboard otherwise go to sign up page
					!!user ? <Redirect to="/dashboard" /> : <SignUp />
				}
			</Route>
			<Route path="/signin">
				{
					// if user is logged in go to dashboard otherwise go to sign in page
					!!user ? <Redirect to="/dashboard" /> : <SignIn />
				}
			</Route>
			<Route path="/explore">
				{
					// if user is logged in and is a developer go to explore page if user is a nonprofit go to home
					// if user is not logged in go to sign in page
					!!user ? isDev ? <Explore /> : <Redirect to="/" /> : <SignIn />
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
