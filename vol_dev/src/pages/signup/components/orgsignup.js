import { useState } from "react";
import axios from 'axios';
import "../scss/signup.scss";
import { setStorageSessionExpire } from "../../../utils";

const OrgSignUp = () => {
	const [Name, setName] = useState("")
	const [Email, setEmail] = useState("")
	const [Password, setPassword] = useState("")
	const [cPassword, setcPassword] = useState("")
	const [Website, setWebsite] = useState("")
	const [Phone, setPhone] = useState("")
	const [Country, setCountry] = useState("")

	const submitForm = (e) => {
		e.preventDefault()

		let token
		axios.post("https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/np-signup", {
			npEmail: Email,
			npPhoneNumber: Phone,
			npPassword: Password,
			npConfirmPassword: cPassword,
			npDisplayName: Name,
			npWebsite: Website,
			npCountry: Country
		})
			.then((response) => {
				token = response.data.token
				console.log(response.data)
				console.log(token)
				if (token === "undefined") {}//TODO: Account created but Authentication failed

				// Store it in session storage
				setStorageSessionExpire("isDev", false, 3600000)
				setStorageSessionExpire("token", token, 3600000)

				//TODO: Successfully created an account and signed in -- wut now?
			})
			.catch((err) => {
				console.log(err)
				console.log(err.response.data)
				console.log(err.response.status)
				console.log(err.response.headers)

				if (err.response) {
					//TODO: Handle password too short, email taken, passwords don't match, etc errors
					switch (err.response.error) {
						case "The email address is already in use by another account.":
							break;
						case "Email cannot be empty":
							break;
						case "Email is invalid":
							break;
						case "Name cannot be empty":
							break;
						case "Password cannot be empty":
							break;
						case "Passowrds do not match":
							break;
					}

				} else if (err.request) {
					// request made but no response from server
					console.log(err.request)
				} else {
					// error occurred before request was sent
					console.log(err.config)
				}
			})
	};

	return (
		<div className="orgsignup">
			<form onSubmit={submitForm}>
				<div className="form-field">
					<label htmlFor="orgname">Organization Name</label>
					<input type="text" id="orgname" value={Name} onChange={e => setName(e.target.value)}/>
				</div>
				<div className="form-field">
					<label htmlFor="orgEmail">Organization Email</label>
					<input type="text" id="orgEmail" value={Email} onChange={e => setEmail(e.target.value)}/>
				</div>
				<div className="form-field">
					<label htmlFor="orgPass">Enter Password</label>
					<input type="password" id="orgPass" value={Password} onChange={e => setPassword(e.target.value)}/>
				</div>
				<div className="form-field">
					<label htmlFor="orgcPass">Enter Password</label>
					<input type="password" id="orgcPass" value={cPassword} onChange={e => setcPassword(e.target.value)}/>
				</div>
				<div className="form-field">
					<label htmlFor="orgWeb">Organization Website</label>
					<input type="text" id="orgWeb" value={Website} onChange={e => setWebsite(e.target.value)}/>
				</div>
				<div className="form-field">
					<label htmlFor="orgPhone">Phone Number</label>
					<input type="text" id="orgPhone" value={Phone} onChange={e => setPhone(e.target.value)}/>
				</div>
				<div className="form-field">
					<label htmlFor="orgPhone">Country</label>
					<input type="text" id="orgPhone" value={Country} onChange={e => setCountry(e.target.value)}/>
				</div>
				<button className="signupButton">Sign Up</button>
			</form>
		</div>
	);
};



export default OrgSignUp;
