import "../scss/signup.scss";

const OrgSignUp = () => {
	return (
		<div className="orgsignup">
			<form onSubmit={submitForm}>
				<div className="form-field">
					<label htmlFor="orgname">Organization Name</label>
					<input type="text" id="orgname" />
				</div>
				<div className="form-field">
					<label htmlFor="orgemail">Organization Email</label>
					<input type="text" id="orgemail" />
				</div>
				<div className="form-field">
					<label htmlFor="orgpass">Enter Password</label>
					<input type="password" id="orgpass" />
				</div>
				<div className="form-field">
					<label htmlFor="orgcpass">Enter Password</label>
					<input type="password" id="orgcpass" />
				</div>
				<div className="form-field">
					<label htmlFor="orgweb">Organization Website</label>
					<input type="text" id="orgweb" />
				</div>
				<button className="signupButton">Sign Up</button>
			</form>
		</div>
	);
};

const submitForm = (e) => {
	e.preventDefault();
	const orgname = e.target[0].value;

	// Token
	let gHtoken; // This is where you store the token

	let user = {
		token: gHtoken,
		loggedIn: true,
		isDev: false,
	};

	// Store it in local storage
	localStorage.setItem("user", user);
};

export default OrgSignUp;
