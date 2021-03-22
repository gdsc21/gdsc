import { useState } from "react";
import axios from 'axios';

const SignIn = () => {
	const [Email, setEmail] = useState("")
	const [Password, setPassword] = useState("")

	const orgLogin = (e) => {
		e.preventDefault()

		let token
		const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/np-login"
		let data = {
			npEmail: Email,
			npPassword: Password
		}

		axios
			.post(url, data)
			.then((response) => {
				token = response.data.token
				if (token === "undefined") {} // TODO: Token was not returned but request was success
				localStorage.setItem("user", {
					token: token,
					loggedIn: true,
					isDev: false,
				});
			})
			.catch((err) => {
				// TODO authentication failure
			})
	}

	return (
		<div className="orglogin">
			<form onSubmit={ orgLogin }>
				<div className="form-field">
					<label htmlFor="orgemail">Enter your email</label>
					<input type="text" id="orgname" value={Email} onChange={e => setEmail(e.target.value)}/>
					<br />
				</div>
				<div className="form-field">
					<label htmlFor="orgpass">Enter password</label>
					<input type="text" id="orgpass" value={Password} onChange={e => setPassword(e.target.value)}/>
					<br />
				</div>
				<button className="loginButton">Log In</button>
			</form>
		</div>

	);
};

export default SignIn;
