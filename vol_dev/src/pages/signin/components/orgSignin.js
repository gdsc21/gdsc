import { useState } from "react";
import axios from "axios";
import "../styles/signin.css";
import { fbApp, fs, fb } from "../../../firebase";
import {setStorageSessionExpire} from "../../../utils";

const OrgSignIn = ({ setSelection }) => {
	// Form values
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");

	// Form errors
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [formError, setFormError] = useState("");

	const orgLogin = (e) => {
		e.preventDefault();

		setFormError("");
		if (emailError || passwordError) {
			setFormError("Cannot sign in as there are errors in the values entered.");
			return;
		}
		console.log(Email, Password)
		let token;
		fbApp
			.auth()
			.setPersistence(fb.auth.Auth.Persistence.SESSION)
			.then(() => {
				return fbApp.auth().signInWithEmailAndPassword(Email, Password)
			})
			.then((userCredential) => {
				return userCredential.user.getIdToken(true);
			})
			.then((newToken) => {
				token = newToken;

				setStorageSessionExpire("isDev", false, 3600000);
				setStorageSessionExpire("token", token, 3600000);

				// Redirect to dashboard
				window.location.href = "/dashboard";
			})
			.catch((err) => {
				switch (err.code) {
					case "auth/invalid-email":
						setEmailError("The email you entered is invalid.");
						break;
					case "auth/user-disabled":
						setFormError(
							"The user associated with this email has been disabled. Please sign-up again."
						);
						break;
					case "auth/user-not-found":
						setFormError("Your sign in credentials are invalid");
						break;
					case "auth/wrong-password":
						setFormError("Your sign in credentials are invalid");
						break;
					default:
						setFormError("There was an error logging you in. Please try again later.");
				}
			});
	};

	const goBack = () => {
		setSelection("main-page");
	};

	return (
		<div className="orgsignin">
			<form onSubmit={orgLogin}>
				<span className="back-btn" onClick={goBack}>
					<i class="fas fa-chevron-left"></i>
				</span>

				<h3 className="title">Non-Profit Sign-In</h3>

				<div className="form-field">
					<label htmlFor="orgemail">Email</label>
					<input
						type="text"
						id="orgname"
						value={Email}
						onChange={(e) => setEmail(e.target.value)}
						onBlur={() => {
							if (Email == "") setEmailError("Email cannot be empty");
							else setEmailError("");
						}}
					/>
					<p className="error">{emailError}</p>
				</div>

				<div className="form-field">
					<label htmlFor="orgpass">Password</label>
					<input
						type="text"
						id="orgpass"
						value={Password}
						onChange={(e) => setPassword(e.target.value)}
						onBlur={() => {
							if (Password == "") setPasswordError("Password cannot be empty");
							else setPasswordError("");
						}}
					/>
					<p className="error">{passwordError}</p>
				</div>

				<p className="form-error error">{formError}</p>
				<button className="loginButton">Log In</button>
			</form>
		</div>
	);
};

export default OrgSignIn;
