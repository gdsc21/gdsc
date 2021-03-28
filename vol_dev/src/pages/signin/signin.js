import React, { useState } from "react";
import "./styles/signin.css";
import { Link } from "react-router-dom";

// Import components
import Header from "./components/header";
import MainPage from "./components/mainpage";
import OrgSignIn from "./components/orgSignin";

const SignIn = () => {
	const [selection, setSelection] = useState("main-page");

	return (
		<div className="signin">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
				integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
				crossorigin="anonymous"
			/>

			<Header />
			{selection === "main-page" ? (
				<MainPage setSelection={setSelection} />
			) : selection === "org" ? (
				<OrgSignIn setSelection={setSelection} />
			) : (
				""
			)}

			<div className="have-account">
				<Link className="have-account" to="/signup">
					Don't have an account?
				</Link>
			</div>
		</div>
	);
};

export default SignIn;
