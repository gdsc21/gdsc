import { useContext, useState } from "react";
import {authErrorCheck, getSessionStorageExpire, signOut} from "../../../utils";
import { UserContext } from "../../../store";
import axios from "axios";
import Modal from "../../Components/modal";

const NpCreateProjectModal = ({ showCreateProject, setShowCreateProject }) => {
	const { updateUserStore } = useContext(UserContext);

	const [projTitle, setProjTitle] = useState(null);
	const [projDescription, setProjDescription] = useState(null);

	const createProject = (e) => {
		e.preventDefault();

		let data = {
			projTitle: projTitle,
			projDescription: projDescription,
			projGithub: "",
		};
		// get token and if token is null redirect to sign in
		let token = getSessionStorageExpire("token");
		if (!token) {
			signOut()
			window.location.href = "/signin";
		}

		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/projectApp/create-project";

		axios
			.post(url, data, config)
			.then((response) => {
				if (!response.data.projectId) throw new Error("projectId not returned");
				const getProfileUrl = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/npApp/get-np"
				axios
					.get(getProfileUrl, config)
					.then(newResponse => {
						data = newResponse.data;
						updateUserStore({ type: "set", payload: data})
					})
					.catch((err) => {
						authErrorCheck(err);
					});
			})
			.catch((err) => {
				console.log(err);
				try {
					console.log(err.response.status);
					console.log(err.response);
				} catch {}
			});
	};

	return (
		<Modal open={showCreateProject} setOpen={setShowCreateProject} title="Create DevProjectModal">
			<form className="create-modal" onSubmit={createProject}>
				<label htmlFor="projTitle">DevProjectModal Title</label>
				<input
					type="text"
					name="projTitle"
					placeholder="e.g. Salvation Army Website Redesign"
					value={projTitle}
					onChange={(e) => setProjTitle(e.target.value)}
				/>

				<label htmlFor="projDescription">DevProjectModal Description</label>
				<input
					type="text"
					name="projDescription"
					placeholder="e.g. Redesign the Salvation Army website and create an account system."
					value={projDescription}
					onChange={(e) => setProjDescription(e.target.value)}
				/>
				<div className="edit-profile__buttons">
					<button
						className="edit-profile__cancel"
						onClick={(e) => {
							e.preventDefault();
							setShowCreateProject(false);
						}}
					>
						Cancel
					</button>

					<button className="edit-profile__save" type="submit">Save</button>
				</div>
			</form>

		</Modal>
	);
};

export default NpCreateProjectModal;
