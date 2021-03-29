import { useState } from "react";
import axios from "axios";
import "../scss/signup.scss";
import { setStorageSessionExpire } from "../../../utils";
import { Link } from "react-router-dom";
import Country from "./country";

const OrgSignUp = ({ setSelection }) => {
	// Form values
	const [orgName, setOrgName] = useState("");
	const [Name, setName] = useState("");
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");
	const [cPassword, setcPassword] = useState("");
	const [Website, setWebsite] = useState("");
	const [Phone, setPhone] = useState("");
	const [country, setCountry] = useState("");

	// Form errors
	const [orgNameError, setOrgNameError] = useState("");
	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPassError, setConfirmPassError] = useState("");
	const [formError, setFormError] = useState("");

	const submitForm = (e) => {
		e.preventDefault();

		setFormError("");

		if (orgNameError || nameError || emailError || passwordError || confirmPassError) {
			setFormError("Cannot submit as there are invalid fields in this form");
			return;
		}

		let token;
		axios
			.post("https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/np-signup", {
				npEmail: Email,
				npPhoneNumber: Phone,
				npPassword: Password,
				npConfirmPassword: cPassword,
				npDisplayName: Name,
				npWebsite: Website,
				npCountry: country,
			})
			.then((response) => {
				token = response.data.token;
				console.log(response.data);
				console.log(token);
				if (token === "undefined") {
					// Account created but Authentication failed
					setFormError("Your account was successfully created, please sign in.");
				}

				// Store it in session storage
				setStorageSessionExpire("isDev", false, 3600000);
				setStorageSessionExpire("token", token, 3600000);

				// Successfully created an account and signed in -- wut now?
				// Go to the dashboard
				window.location.href = "/dashboard";
			})
			.catch((err) => {
				console.log(err);
				console.log(err.response.data);
				console.log(err.response.status);
				console.log(err.response.headers);

				if (err.response) {
					setFormError(err.response.error);
				} else if (err.request) {
					// request made but no response from server
					setFormError("An unknown error occurred, please try again later.");
					console.error(err.request);
				} else {
					// error occurred before request was sent
					setFormError("An unknown error occurred, please try again later.");
					console.error(err.config);
				}
			});
	};

	const goBack = () => {
		setSelection("main-page");
	};

	return (
		<div className="orgsignup">
			<form onSubmit={submitForm}>
				<span className="back-btn" onClick={goBack}>
					<i class="fas fa-chevron-left"></i>
				</span>

				<h3 className="title">Non-Profit Sign Up</h3>
				<div className="form-field">
					<label htmlFor="orgName">Non-Profit Name</label>
					<input
						type="text"
						id="orgName"
						value={orgName}
						onChange={(e) => setOrgName(e.target.value)}
						onBlur={() => {
							if (orgName == "") setOrgNameError("The non-profit name cannot be empty");
							else setOrgNameError("");
						}}
					/>
					<p className="error">{orgNameError}</p>
				</div>

				<div className="form-field">
					<label htmlFor="orgWeb">Non-Profit Website</label>
					<input
						type="text"
						id="orgWeb"
						value={Website}
						onChange={(e) => setWebsite(e.target.value)}
					/>
					<p className="error"></p>
				</div>

				<div className="form-field">
					<label htmlFor="name">Main Point of Contact (Liaison) Full Name</label>
					<input
						type="text"
						id="name"
						value={Name}
						onChange={(e) => setName(e.target.value)}
						onBlur={() => {
							if (Name == "") setNameError("Name cannot be empty");
							else setNameError("");
						}}
					/>
					<p className="error">{nameError}</p>
				</div>

				<div className="form-field">
					<label htmlFor="orgEmail">Liaison Organization Email</label>
					<input
						type="text"
						id="orgEmail"
						value={Email}
						onChange={(e) => setEmail(e.target.value)}
						onBlur={() => {
							if (Email == "") setEmailError("Email cannot be empty");
							else setEmailError("");
						}}
					/>
					<p className="error">{emailError}</p>
				</div>

				<div className="password">
					<div className="form-field">
						<label htmlFor="orgPass">Password</label>
						<input
							type="password"
							id="orgPass"
							value={Password}
							onChange={(e) => setPassword(e.target.value)}
							onBlur={() => {
								if (Password == "") setPasswordError("Password cannot be empty");
								else setPasswordError("");
							}}
						/>
						<p className="error">{passwordError}</p>
					</div>

					<div className="form-field">
						<label htmlFor="orgcPass">Confirm Password</label>
						<input
							type="password"
							id="orgcPass"
							value={cPassword}
							onChange={(e) => setcPassword(e.target.value)}
							onBlur={() => {
								if (cPassword == "") setConfirmPassError("This field cannot be empty");
								else if (cPassword != Password) setConfirmPassError("Passwords do not match");
								else setConfirmPassError("");
							}}
						/>
						<p className="error">{confirmPassError}</p>
					</div>
				</div>

				<div className="additional-info">
					<div className="form-field">
						<label htmlFor="orgPhone">Phone Number</label>
						<input
							type="text"
							id="orgPhone"
							value={Phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
						<p className="error"></p>
					</div>

					<div className="form-field">
						<label htmlFor="country">Country</label>
						<Country className="country" country={country} setCountry={setCountry} />
						<p className="error"></p>
					</div>
				</div>

				<p className="form-error error">{formError}</p>
				<button className="signupButton">CREATE ACCOUNT</button>
			</form>
		</div>
	);
};

export default OrgSignUp;
