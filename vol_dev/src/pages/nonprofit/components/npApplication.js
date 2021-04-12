import { getSessionStorageExpire, signOut } from "../../../utils";
import axios from "axios";

const NpApplication = ({ projectId, projectData }) => {
	const projectURL = projectId ? `/project/${projectId}` : "/";

	const acceptDev = () => {
		let data = {
			devUid:
				Object.entries(projectData.developers) && Object.entries(projectData.developers)[0][0],
			projectId: projectId,
		};

		// get token and if token is null redirect to sign in
		let token = getSessionStorageExpire("token");
		if (!token) {
			signOut();
			window.location.href = "/signin";
		}

		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/accept-dev";
		// const url = "http://localhost:5001/sunlit-webbing-305321/us-central1/applicationsApp/accept-dev"

		axios
			.post(url, data, config)
			.then((response) => {})
			.catch((err) => {
				console.log(err);
				console.warn("Error:", err);
			});
	};

	return (
		<div className="devproject">
			<div className="title">
				<h4>Title</h4>
				<p>{projectData.projectInfo.projTitle}</p>
			</div>

			<div className="description-div">
				<h4>Description</h4>
				<p>{projectData.projectInfo.projDescription}</p>
			</div>

			<div className="dev-application-status">
				<h4>Status</h4>
				<p>{projectData.appStatus ? projectData.appStatus : "Pending"}</p>
			</div>

			{
				// TODO: There are no roles for projects yet but we need to add the github repo link and the non-profits name
				// <div>
				// 	<h4>Role</h4>
				// 	<p className="role">{project.role}</p>
				// </div>
				// TODO: Add a way to quantify the project's progess
				// <div className="progress">
				// 	<h4>Progress</h4>
				// 	<progress value={project.progress} max={100} />
				// 	{project.progress}%
				// </div>
			}

			<div className="goto-btn" onClick={acceptDev}>
				<a>Accept Developer</a>
			</div>
		</div>
	);
};

export default NpApplication;
