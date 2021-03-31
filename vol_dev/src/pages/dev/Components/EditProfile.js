import { getSessionStorageExpire } from "../../../utils";
import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/dev.css";

const EditProfile = ({ user, setShowEditProfile }) => {
	const [devName, setDevName] = useState(user.devDisplayName);
	const [devTitle, setDevTitle] = useState(user.devTitle);
	const [devBio, setDevBio] = useState(user.devBio);
	const [devWebsite, setDevWebsite] = useState(user.devLinks.devWebsite);
	const [devLinkedIn, setDevLinkedIn] = useState(user.devLinks.devLinkedIn);

	const editDevProfile = (e) => {
		e.preventDefault();

		let data = {
			devDisplayName: devName,
			devTitle: devTitle,
			devBio: devBio,
			devLinks: {
				devWebsite,
				devLinkedIn
			}
		};

		// get token and if token is null redirect to sign in
		let token = getSessionStorageExpire("token");
		if (!token) window.location.href = "/signin";

		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const url =
			// "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/update-dev-profile";
			"http://localhost:5001/sunlit-webbing-305321/us-central1/userRoutes/update-dev-profile"

		axios
			.post(url, data, config)
			.then((response) => {
				// TODO: success -- redirect to dashboard
				console.log(response)
			})
			.catch((err) => {
				console.log(err.response.data)
				console.warn("Profile Update Error:", err.response.status)
			});
	};

	return (
		<form className="dev__edit-profile" onSubmit={editDevProfile}>
			<label htmlFor="devDisplayName">Display Name</label>
			<input
				type="text"
				name="devDisplayName"
				placeholder="e.g. Ada Lovelace"
				value={devName}
				onChange={(e) => setDevName(e.target.value)}
			/>

			<label htmlFor="devTitle">Title</label>
			<input
				type="text"
				name="devTitle"
				placeholder="e.g. Computer Programmer"
				value={devTitle}
				onChange={(e) => setDevTitle(e.target.value)}
			/>

			<label htmlFor="devBio">Biography</label>
			<textarea
				type="text"
				name="devBio"
				maxLength="140"
				placeholder="e.g. I like sunsets and long walks on the beach"
				value={devBio}
				onChange={(e) => setDevBio(e.target.value)}
			/>

			<label htmlFor="devWebsite">Portfolio</label>
			<input
				type="text"
				name="devWebsite"
				placeholder="e.g. f1rstpro0gr4mm3r.io"
				value={devWebsite}
				onChange={(e) => setDevWebsite(e.target.value)}
			/>

			<label htmlFor="devLinkedIn">LinkedIn</label>
			<input
				type="text"
				name="devLinkedIn"
				placeholder="e.g. linkedin.com/in/AdaLovelace"
				value={devLinkedIn}
				onChange={(e) => setDevLinkedIn(e.target.value)}
			/>

			<div className="edit-profile__buttons">
				<button
					className="edit-profile__cancel"
					onClick={(e) => {
						e.preventDefault();
						setShowEditProfile(false);
					}}
				>
					Cancel
				</button>
				<button className="edit-profile__save">Save</button>
			</div>
		</form>
	);
};

export default EditProfile;
