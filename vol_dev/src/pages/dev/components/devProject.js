import { getSessionStorageExpire } from "../../../utils";
import axios from "axios";
import { Link } from "react-router-dom";

const DevProject = ({ projectId, projectData, explore }) => {
	const projectURL = projectId ? `/project/${projectId}` : "/";

	const applyProject = () => {
		let data = { projectId: projectId };

		// get token and if token is null redirect to sign in
		let token = getSessionStorageExpire("token");
		if (!token) window.location.href = "/signin";

		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/apply-project";

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
			<h3>{projectData.npDisplayName}</h3>

			<div className="title">
				<h4>Title</h4>
				<p>{projectData.projTitle}</p>
			</div>

			<div className="description-div">
				<h4>Description</h4>
				<p className="description">{projectData.projDescription}</p>
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

			{explore ? (
				<div className="goto-btn" onClick={applyProject}>
					<a>Apply to Project</a>
				</div>
			) : (
				<div className="goto-btn" onClick={applyProject}>
					<Link className="goto-btn" to={projectURL}>
						Go to Project
					</Link>
				</div>
			)}
		</div>
	);
};

export default DevProject;
