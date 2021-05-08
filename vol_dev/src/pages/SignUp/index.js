import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./scss/signup.css";

// Import components
import Header from "./components/header";
import NpSignUpForm from "./components/NpSignUpForm";
import DevSignUpCard from "./components/DevSignUpCard";
import NpSignUpCard from "./components/NpSignUpCard";

const SignUp = () => {
	const [selection, setSelection] = useState("dev-or-np");

	return (
		<div className="signup">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
				integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
				crossOrigin="anonymous"
			/>

			<Header />
			{
				selection === "dev-or-np" ? (
					<div className="main_signup">
						<h3 className="heading">Which of these describes you best?</h3>
						<div className="cards">
							<DevSignUpCard />
							<NpSignUpCard setSelection={setSelection} />
						</div>
					</div>
				)
					: <NpSignUpForm setSelection={setSelection} />
			}

			<div className="have-account">
				<Link className="have-account" to="/signin">
					Already have an account?
				</Link>
			</div>
		</div>
	);
};

export default SignUp;
