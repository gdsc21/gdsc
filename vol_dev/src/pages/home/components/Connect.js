import React from "react";
import "../styles/homepage.css";

const Connect = () => {
	return (
		<div name="contact" className="connect">
			<div className="title">
				<h4>questions, comments, concerns?</h4>
				<h2>let's connect!</h2>
			</div>
			<form onSubmit={submitForm}>
				<label htmlFor="connect-name">name</label>
				<input type="text" id="connect-name" />
				<label htmlFor="connect-email">email</label>
				<input type="text" id="connect-email" />
				<label htmlFor="connect-subject">subject</label>
				<input type="text" id="connect-subject" />
				<label htmlFor="connect-message">message</label>
				<textarea className="message" type="text" id="connect-message" />

				<button>submit</button>
			</form>
		</div>
	);
};

const submitForm = (e) => {
	e.preventDefault();
};

export default Connect;
