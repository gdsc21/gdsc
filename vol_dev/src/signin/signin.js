import React from "react";

class signin extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className="orglogin">
				<div className="form-field">
					<label htmlFor="orgemail">Enter your email</label>
					<input type="text" id="orgname" />
					<br />
				</div>
				<div className="form-field">
					<label htmlFor="orgpass">Enter password</label>
					<input type="text" id="orgpass" />
					<br />
				</div>
				<button className="loginButton">Log In</button>
			</div>
		);
	}
}
export default OrgLogIn;
