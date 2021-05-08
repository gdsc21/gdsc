import React, { useState } from "react";
import "./styles/signin.css";
import { Link } from "react-router-dom";

// Import components
import Header from "./components/header";
import NpSignInForm from "./components/NpSignInForm";
import DevSignInCard from "./components/DevSignInCard";
import NpSignInCard from "./components/NpSignInCard";

const SignIn = () => {
	const [selection, setSelection] = useState("dev-or-np");

	return (
		<div className="signin">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
				integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
				crossOrigin="anonymous"
			/>

			<Header />
			{
				selection === "dev-or-np" ? (
						<div className="main_signin">
							<h3 className="heading">Select your role to log back in</h3>
							<div className="cards">
								<DevSignInCard />
								<NpSignInCard setSelection={setSelection} />
							</div>
						</div>
					) :
				selection === "np" ? <NpSignInForm setSelection={setSelection} /> : ""
			}

			<div className="have-account">
				<Link className="have-account" to="/signup">
					Don't have an account?
				</Link>
			</div>
		</div>
	);
};

export default SignIn;
