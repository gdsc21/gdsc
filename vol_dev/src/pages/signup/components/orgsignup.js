import { useState } from "react";
import axios from 'axios';
import "../scss/signup.scss";

const OrgSignUp = () => {
	const [Name, setName] = useState("")
	const [Email, setEmail] = useState("")
	const [Password, setPassword] = useState("")
	const [cPassword, setcPassword] = useState("")
	const [Website, setWebsite] = useState("")
	const [Phone, setPhone] = useState("")
	const [Country, setCountry] = useState("")

	const submitForm = (e) => {
		e.preventDefault();

		let token
		axios.post("", {
			npEmail: Email,
			npPhoneNumber: Phone,
			npPassword: Password,
			npConfirmPassword: cPassword,
			npDisplayName: Name,
			npCountry: Country
		})
			.then((response) => {
				token = response.data.token
			})
			.catch((err) => {
				console.log(err)
			})

		if (token === "undefined") {}//TODO: Authentication failed --- wut now?}
		let user = {
			token: token,
			loggedIn: true,
			isDev: false,
		};

		// Store it in local storage
		localStorage.setItem("user", user);
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
					<input type="password" id="orgPass" value{Password} onChange={e => setPassword(e.target.value)}/>
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
					<label htmlFor="orgPhone">Organization Website</label>
					<input type="text" id="orgPhone" value={Country} onChange={e => setCountry(e.target.value)}/>
				</div>
				<button className="signupButton">Sign Up</button>
			</form>
		</div>
	);
};



export default OrgSignUp;
