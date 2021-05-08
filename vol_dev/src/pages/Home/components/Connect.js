import React from "react";
import "../styles/homepage.css";

const Connect = () => {
	return (
		<div name="contact" className="connect">
			<div className="title">
				<h4>questions, comments, concerns?</h4>
				<h2>let's connect!</h2>
			</div>
			<form
				id="homeContactForm"
				action="https://formspree.io/f/xnqoegbg"
				method="POST"
				onSubmit={handleSubmit}
			>
				<label htmlFor="connect-name">name</label>
				<input type="text" id="connect-name" name="name" />
				<p className="warning-msg" id="my-form-status__name"></p>

				<label htmlFor="connect-email">email</label>
				<input type="text" id="connect-email" name="email" />
				<p className="warning-msg" id="my-form-status__email"></p>

				<label htmlFor="connect-subject">subject</label>
				<input type="text" id="connect-subject" name="subject" />
				<p className="warning-msg" id="my-form-status__subject"></p>

				<label htmlFor="connect-message">message</label>
				<textarea className="message" type="text" id="connect-message" name="message" />
				<p className="warning-msg" id="my-form-status__message"></p>

				<button>submit</button>

				<p id="my-form-status"></p>
			</form>
		</div>
	);
};

async function handleSubmit(event) {
	event.preventDefault();
	const status = document.getElementById("my-form-status");
	const data = new FormData(event.target);
	const form = event.target;
	let valid = true;

	// Validate form data
	const namemsg = document.getElementById("my-form-status__name");
	if (event.target[0].value === "") {
		namemsg.innerHTML = "Your name cannot be empty";
		valid = false;
	} else {
		namemsg.innerHTML = null;
	}

	const emailmsg = document.getElementById("my-form-status__email");
	const email = event.target[1].value;
	const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (!re.test(email)) {
		emailmsg.innerHTML = "Your email must be valid";
		valid = false;
	} else {
		emailmsg.innerHTML = null;
	}

	const subjectmsg = document.getElementById("my-form-status__subject");
	if (event.target[2].value === "") {
		subjectmsg.innerHTML = "Your subject cannot be empty";
		valid = false;
	} else {
		subjectmsg.innerHTML = null;
	}

	const msgmsg = document.getElementById("my-form-status__message");
	if (event.target[3].value === "") {
		msgmsg.innerHTML = "Your message cannot be empty";
		valid = false;
	} else {
		msgmsg.innerHTML = null;
	}

	// Submit the form if it's valid
	if (valid) {
		fetch(event.target.action, {
			method: form.method,
			body: data,
			headers: {
				Accept: "application/json",
			},
		})
			.then((response) => {
				status.innerHTML = "Thanks for your submission!";
				form.reset();
			})
			.catch((error) => {
				status.innerHTML = "Oops! There was a problem submitting your form";
				console.error(error);
			});
	} else {
		status.innerHTML = null;
	}
}

export default Connect;
