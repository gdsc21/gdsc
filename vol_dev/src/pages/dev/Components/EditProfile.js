import {authErrorCheck, getSessionStorageExpire, removeSessionStorage} from "../../../utils";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import "../styles/dev.css";
import {UserContext} from "../../../store";
import {fbApp} from "../../../firebase";

const EditProfile = ({ user, setShowEditProfile }) => {
	const { userStore, updateUserStore } = useContext(UserContext)

	const [devName, setDevName] = useState(userStore.devDisplayName);
	const [devTitle, setDevTitle] = useState(userStore.devTitle);
	const [devBio, setDevBio] = useState(userStore.devBio);
	const [devWebsite, setDevWebsite] = useState(userStore.devLinks.devWebsite);
	const [devLinkedIn, setDevLinkedIn] = useState(userStore.devLinks.devLinkedIn);

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
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/update-dev-profile";

		axios
			.post(url, data, config)
			.then((response) => {
				// TODO: success -- redirect to dashboard
				const getProfileUrl = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-dev-profile"
				axios
					.get(getProfileUrl, config)
					.then((newResponse) => {
						data = newResponse.data;
						updateUserStore({ type: "set", payload: data})
					})
					.catch((err) => {
						authErrorCheck(err)
					})
			})
			.catch((err) => {
				console.log(err)
				console.warn("Profile Update Error:", err)
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
