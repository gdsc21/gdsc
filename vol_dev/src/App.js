import React, { useEffect, useState, useReducer } from "react";
import { Home, SignUp, SignIn, Project, Explore, NonProfit, Dev } from "./pages";
import {Switch, Route, Redirect, BrowserRouter as Router} from "react-router-dom";
import { fbApp } from "./firebase";
import { Context, userDataReducer, userData, loadContext } from "./store";

const App = () => {
	const [store, dispatch] = useReducer(userDataReducer, userData)
	const [isDev, setDev] = useState(null);

	// user is the user info provided by firebase authentication
	const [user, setUser] = useState(null);

	// this loads the context from session storage everytime this component is mounted for the first time
	// this enables context to persist across page refreshes
	useEffect(() => {
		const persistedContext = loadContext();
		dispatch({type: "set", payload: persistedContext})
	}, [])

	useEffect(() => {
		fbApp.auth().onAuthStateChanged(setUser);
		try {
			setDev(user.providerData[0].providerId === "github.com");
			console.log(user)
		} catch {}
	}, [user]);

	return (
		<Context.Provider value={{ store, dispatch }}>
			<Switch>
				<Route exact path="/signup">
					{
						// if user is logged in go to dashboard otherwise go to sign up page
						!!user ? <Redirect to="/dashboard" /> : <SignUp />
					}
				</Route>
				<Route exact path="/signin">
					{
						// if user is logged in go to dashboard otherwise go to sign in page
						!!user ? <Redirect to="/dashboard" /> : <SignIn />
					}
				</Route>
				<Route exact path="/dashboard">
					{
						// if user is logged in and a developer go to Dev if not a developer go to NonProfit
						// if user is not logged in go to home
						!!user ? isDev ? <Dev /> : <NonProfit /> : <Redirect to="/" />

						// <Dev /> // for debugging the dashboard
					}
				</Route>
				<Route exact path="/project/:id">
					{
						// if user is logged in, do to the project page
						// if user is not logged in go to home
						!!user ? <Project /> : <Redirect to="/" />

						// <Project /> // for Project page debugging
					}
				</Route>
				<Route exact path="/explore">
					{
						// if user is logged in and is a developer go to explore page if user is a nonprofit go to home
						// if user is not logged in go to sign in page
						!!user ? <Explore /> : <SignIn />
					}
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Context.Provider>
	);
};

export default App;
