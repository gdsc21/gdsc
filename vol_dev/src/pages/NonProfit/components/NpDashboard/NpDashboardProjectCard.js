import { Link } from "react-router-dom";

const NpDashboardProjectCard = ({ projectId, projectData }) => {
	const projectURL = projectId ? `/project/${projectId}` : "/";

	return (
		<div className="devproject">
			<div>
				<h4>Title</h4>
				<p className="title">{projectData.projTitle}</p>
			</div>

			<div className="description-div">
				<h4>Description</h4>
				<p className="description">{projectData.projDescription}</p>
			</div>

			{
				// TODO: Add a way to quantify the project's progess
				// <div className="progress">
				// 	<h4>Progress</h4>
				// 	<progress value={project.progress} max={100} />
				// 	{project.progress}%
				// </div>
			}

			<Link className="goto-btn" to={projectURL}>
				Go to Project
			</Link>
		</div>
	);
};

export default NpDashboardProjectCard;
