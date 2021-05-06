import { authErrorCheck, getSessionStorageExpire, signOut } from "../../../utils";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../../store";

import Modal from "../../components/modal";

const DevEditProfileModal = ({ showEditProfile, setShowEditProfile }) => {
	const { userStore, updateUserStore } = useContext(UserContext);

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
				devLinkedIn,
			},
		};

		// Get token and if token is null redirect to sign in
		let token = getSessionStorageExpire("token");
		if (!token) {
			signOut();

			window.location.assign("/signin");
		}

		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/devApp/update-dev-profile";

		axios
			.post(url, data, config)
			.then((response) => {
				const getProfileUrl =
					"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/devApp/get-dev-profile";
				axios
					.get(getProfileUrl, config)
					.then((newResponse) => {
						data = newResponse.data;
						updateUserStore({ type: "set", payload: data });
					})
					.catch((err) => {
						authErrorCheck(err);
					});
				setShowEditProfile(false);
			})
			.catch((err) => {
				console.log(err);
				console.warn("Profile Update Error:", err);
			});
	};

	return (
		<Modal open={showEditProfile} setOpen={setShowEditProfile} title="Edit Profile">
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
					<button className="edit-profile__save" onClick={editDevProfile}>
						Save
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default DevEditProfileModal;
