import {getSessionStorageExpire} from "../../../utils";
import DevProjectCardBTN from "./DevProjectCardBTN";
import axios from "axios";
import {Link} from "react-router-dom";

// projectId should be the projectID
const DevProjectCard = ({ projectId, projectData, page }) => {

	const applyProject = () => {
		let data = { projectId: projectId }

		// get token and if token is null redirect to sign in
		let token = getSessionStorageExpire("token");
		if (!token) window.location.href = "/signin";

		let config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/apply-project";

		axios
			.post(url, data, config)
			.then((response) => {
			})
			.catch((err) => {
				console.log(err);
				console.warn("Error:", err);
			});
	}

	return (
		<div className="devproject">
			<Link to={`/project/${projectId}`}>
				<h4>Title</h4>
				<p className="title">{projectData.projTitle}</p>
			</Link>
			<div className="description-div">
				<h4>Description</h4>
				<p className="description">{projectData.projDescription}</p>
			</div>
			<Link to={`/non-profit/${projectData.npUid}`}>
				<div className="">
					<h4>Non-Profit</h4>
					<p>{projectData.npDisplayName}</p>
				</div>
			</Link>
			<div>
				<h4><a href={projectData.projGithub} target="_blank">Source Code</a></h4>
			</div>
			{
				page === "Explore" ?
					<DevProjectCardBTN btnText={"Apply to Project"} type={"Apply"} projectId={projectId} /> : null

			}
		</div>
	);
};

export default DevProjectCard;
