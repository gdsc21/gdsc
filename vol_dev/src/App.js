import React, {useEffect, useState, useReducer, useContext} from "react";
import { Home, SignUp, SignIn, Project, Explore, NonProfit, Dev } from "./pages";
import {Switch, Route, Redirect, BrowserRouter as Router} from "react-router-dom";
import { UserContext, userDataReducer, userData, loadContext } from "./store";
import { getSessionStorage } from "./utils";

const App = () => {
	// loads the reducer which creates the dispatch function
	const [userStore, updateUserStore] = useReducer(userDataReducer, userData)

	function checkAuth () {
		return getSessionStorage(Object.keys(sessionStorage).filter(item => item.startsWith('firebase:authUser'))[0])
	}

	const user = checkAuth()

	// this loads the context from session storage everytime this component is mounted for the first time
	// this enables context to persist across page refreshes
	useEffect(() => {
		const persistedContext = loadContext();
		updateUserStore({type: "set", payload: persistedContext})
	}, [])

	return (
		<UserContext.Provider value={{ userStore, updateUserStore }}>
			<Switch>
				<Route exact path="/signup">
					{
						// if user is logged in go to dashboard otherwise go to sign up page
						// !!user ? <Redirect to="/dashboard"/> : <SignUp/>
						() => {
							const user = checkAuth()
							if (!!user) return <Redirect to="/dashboard"/>
							else return <SignUp/>
						}
					}
				</Route>
				<Route exact path="/signin">
					{
						// if user is logged in go to dashboard otherwise go to sign in page
						// !!user ? <Redirect to="/dashboard" /> : <SignIn />
						() => {
							const user = checkAuth()
							if (!!user) return <Redirect to="/dashboard" />
							else return <SignIn/>
						}
					}
				</Route>
				<Route exact path="/dashboard">
					{
						// if user is logged in and a developer go to Dev if not a developer go to NonProfit
						// if user is not logged in go to home
						() => {
							const user = checkAuth()
							if (!!user && user.providerData[0].providerId === "github.com") return <Dev/>
							else if (!!user) return <Dev/>
							else return <Redirect to="/" />
						}
						// !!user ?
						// 	user.providerData[0].providerId === "github.com" ?
						// 		<Dev />
						// 	: <NonProfit />
						// : <Redirect to="/" />
						// console.log(!!user) || <Dev/>


						// <Dev /> // for debugging the dashboard
					}
				</Route>
				<Route exact path="/project/:id">
					{
						// if user is logged in, do to the project page
						// if user is not logged in go to home
						// !!user ? <Project /> : <Redirect to="/" />
						() => {
							const user = checkAuth()
							if (!!user) return <Project/>
							else return <Redirect to="/"/>
						}

						// <Project /> // for Project page debugging
					}
				</Route>
				<Route exact path="/explore">
					{
						// if user is logged in and is a developer go to explore page if user is a nonprofit go to home
						// if user is not logged in go to sign in page
						// !!user ? <Explore /> : <SignIn />
						() => {
							const user = checkAuth()
							if (!!user) return <Explore/>
							else return <SignIn/>
						}
					}
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</UserContext.Provider>
	);
};

export default App;
