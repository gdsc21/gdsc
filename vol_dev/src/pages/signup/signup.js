import React, { useState } from "react";
import "./scss/signup.css";

// Import components
import Header from "./components/header";
import MainPage from "./components/mainpage";
import OrgSignUp from "./components/orgsignup";

const SignUp = () => {
	const [selection, setSelection] = useState("main-page");

	return (
		<div className="signup">
			<Header />
			{selection == "main-page" ? (
				<MainPage setSelection={setSelection} />
			) : selection == "org" ? (
				<OrgSignUp setSelection={setSelection} />
			) : (
				""
			)}
		</div>
	);
};

export default SignUp;
