import React from "react";

class signup extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className="orgsignup">
				<div className="form-field">
					<label htmlFor="orgname">Organization Name</label>
					<input type="text" id="orgname" />
					<br />
				</div>
				<div className="form-field">
					<label htmlFor="orgemail">Organization Email</label>
					<input type="text" id="orgemail" />
					<br />
				</div>
				<div className="form-field">
					<label htmlFor="orgpass">Enter Password</label>
					<input type="password" id="orgpass" />
					<br />
				</div>
				<div className="form-field">
					<label htmlFor="orgcpass">Enter Password</label>
					<input type="password" id="orgcpass" />
					<br />
				</div>
				<div className="form-field">
					<label htmlFor="orgweb">Organization Website</label>
					<input type="text" id="orgweb" />
					<br />
				</div>
				<button className="signupButton">Sign Up</button>
			</div>
		);
	}
}
export default OrgSignUp;
