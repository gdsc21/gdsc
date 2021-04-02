import React, { useEffect, useState } from "react";
// import { Home, SignUp, SignIn, Project, Explore, NonProfit, Dev } from "./pages";
import { Home, SignUp, SignIn, NonProfit, Dev } from "./pages";
import { Switch, Route, Redirect } from "react-router-dom";
import { fbApp } from "./firebase";

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
			<Route exact path="/signup">
				{
					// if user is logged in go to dashboard otherwise go to sign up page
					() => {
						if (!!user) return <Redirect to="/dashboard" />;
						else return <SignUp />;
					}
				}
			</Route>
			<Route exact path="/signin">
				{
					// if user is logged in go to dashboard otherwise go to sign in page
					() => {
						if (!!user) return <Redirect to="/dashboard" />;
						else return <SignIn />;
					}
				}
			</Route>
			<Route exact path="/dashboard">
				{
					// if user is logged in and a developer go to Dev if not a developer go to NonProfit
					// if user is not logged in go to home
					() => {
						if (!!user && user.providerData[0].providerId === "github.com")
							return <Dev page="dashboard" />;
						else if (!!user) return <NonProfit page="dashboard" />;
						else return <Redirect to="/" />;
					}

					//debugging nonprofit
					// <NonProfit page="dashboard" />
				}
			</Route>
			<Route exact path="/project/:id">
				{
					// if user is logged in, do to the project page
					// if user is not logged in go to home
					() => {
						if (!!user && user.providerData[0].providerId === "github.com")
							return <Dev page="project" />;
						else if (!!user) return <NonProfit page="project" />;
						else return <Redirect to="/" />;
					}

					// <NonProfit page="project" />
				}
			</Route>
			<Route exact path="/nonprofit">
				<NonProfit page="project" />
			</Route>
			<Route exact path="/explore">
				{
					// if user is logged in and is a developer go to explore page if user is a nonprofit go to home
					// if user is not logged in go to sign in page
					() => {
						if (!!user && user.providerData[0].providerId === "github.com")
							return <Dev page="explore" />;
						else if (!!user) return <NonProfit page="explore" />;
						else return <Redirect to="/" />;
					}
				}
			</Route>
			<Route path="/">
				<Home />
			</Route>
		</Switch>
	);
};

export default App;
