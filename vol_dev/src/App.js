import React, { useEffect, useReducer } from "react";
import { Home, SignUp, SignIn, NonProfit, Dev } from "./pages";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext, userDataReducer, userData, loadContext } from "./store";
import { getSessionStorage } from "./utils";

const App = () => {
	// loads the reducer which creates the dispatch function
	const [userStore, updateUserStore] = useReducer(userDataReducer, userData);

	function checkAuth() {
		return getSessionStorage(
			Object.keys(sessionStorage).filter((item) => item.startsWith("firebase:authUser"))[0]
		);
	}

	// this loads the context from session storage everytime this component is mounted for the first time
	// this enables context to persist across page refreshes
	useEffect(() => {
		const persistedContext = loadContext();
		updateUserStore({ type: "set", payload: persistedContext });
	}, []);

	return (
		<UserContext.Provider value={{ userStore, updateUserStore }}>
			<Switch>
				<Route exact path="/signup">
					{
						// if user is logged in go to dashboard otherwise go to sign up page
						() => {
							const user = checkAuth();
							if (!!user) return <Redirect to="/dashboard" />;
							else return <SignUp />;
						}
					}
				</Route>
				<Route exact path="/signin">
					{
						// if user is logged in go to dashboard otherwise go to sign in page
						() => {
							const user = checkAuth();
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
							const user = checkAuth();
							if (!!user && user.providerData[0].providerId === "github.com")
								return <Dev page="Dashboard" />;
							else if (!!user) return <NonProfit page="dashboard" />;
							else return <Redirect to="/" />;
						}
					}
				</Route>
				<Route exact path="/project/:id">
					{
						// if user is logged in, do to the project page
						// if user is not logged in go to home
						() => {
							const user = checkAuth();
							if (!!user && user.providerData[0].providerId === "github.com")
								return <Dev page="Project" />;
							else if (!!user) return <NonProfit page="project" />;
							else return <Redirect to="/" />;
						}
					}
				</Route>
				<Route exact path="/explore">
					{
						// if user is logged in and is a developer go to explore page if user is a nonprofit go to home
						// if user is not logged in go to sign in page
						() => {
							const user = checkAuth();
							if (!!user && user.providerData[0].providerId === "github.com")
								return <Dev page="Explore" />;
							else if (!!user) return <NonProfit page="explore" />;
							else return <Redirect to="/" />;
						}
					}
				</Route>
				<Route exact path="/applications">
					{
						() => {
							const user = checkAuth();
							if (!!user && user.providerData[0].providerId === "github.com")
								return <Dev page="Applications" />
							else if (!!user) return <NonProfit page="applications" />
							else return <Redirect to="/" />
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
