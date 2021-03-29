import { getSessionStorageExpire } from "../../../utils";
import axios from "axios";
import { useState } from "react";
import "../styles/dev.css";

const EditProfile = ({ user, setShowEditProfile }) => {
	const [devName, setDevName] = useState(user.devDisplayName);
	const [devTitle, setDevTitle] = useState(user.devTitle);
	const [devBio, setDevBio] = useState(user.devBio);
	const [devWebsite, setDevWebsite] = useState(user.devLinks.devWebsite);
	const [devLinkedIn, setDevLinkedIn] = useState(user.devLinks.devLinkedIn);

	const editDevProfile = (e) => {
		e.preventDefault();
		console.log("oop i tried to submit");

		let user = {
			devDisplayName: devName,
			devTitle,
			devBio,
			devLinks: {
				devWebsite,
				devLinkedIn,
			},
		};

		let token = getSessionStorageExpire("token");
		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		// const url =
		// 	"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/dev-create-profile";

		// axios
		// 	.post(url, data, config)
		// 	.then((response) => {
		// 		// TODO: success -- redirect to dashboard
		// 	})
		// 	.catch((err) => {
		// 		// TODO: Error - account was created in Firebase but the associated developer document was not
		// 		// Poll to retry profile completion
		// 	});
	};

	return (
		<form className="dev__edit-profile" onSubmit={editDevProfile}>
			<label htmlFor="devDisplayName">Display Name</label>
			<input
				type="text"
				name="devDisplayName"
				placeholder="e.g. Ada Lovelace"
				value={devName}
				onChange={setDevName}
			/>

			<label htmlFor="devTitle">Title</label>
			<input
				type="text"
				name="devTitle"
				placeholder="e.g. Computer Programmer"
				value={devTitle}
				onChange={setDevTitle}
			/>

			<label htmlFor="devBio">Biography</label>
			<textarea
				type="text"
				name="devBio"
				maxLength="140"
				placeholder="e.g. I like sunsets and long walks on the beach"
				value={devBio}
				onChange={setDevBio}
			/>

			<label htmlFor="devWebsite">Portfolio</label>
			<input
				type="text"
				name="devWebsite"
				placeholder="e.g. f1rstpro0gr4mm3r.io"
				value={devWebsite}
				onChange={setDevWebsite}
			/>

			<label htmlFor="devLinkedIn">LinkedIn</label>
			<input
				type="text"
				name="devLinkedIn"
				placeholder="e.g. linkedin.com/in/AdaLovelace"
				value={devLinkedIn}
				onChange={setDevLinkedIn}
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
