import { Link } from "react-router-dom";

const ProjectCard = ({ projectId, projectData }) => {
	const projectURL = projectId ? `/project/${projectId}` : "/";

	return (
		<div className="devproject">
			<div className="title">
				<h4>Title</h4>
				<p>{projectData.projTitle}</p>
			</div>

			<div className="description-div">
				<h4>Description</h4>
				<p>{projectData.projDescription}</p>
			</div>

			{
				// TODO: There are no roles for projects yet but we need to add the github repo link and the non-profits name
				// <div>
				// 	<h4>Role</h4>
				// 	<p className="role">{projectData.role}</p>
				// </div>
				// TODO: Add a way to quantify the project's progess
				// <div className="progress">
				// 	<h4>Progress</h4>
				// 	<progress value={project.progress} max={100} />
				// 	{project.progress}%
				// </div>
			}

			<div className="goto-btn">
				<Link to={projectURL}>Go to Project</Link>
			</div>
		</div>
	);
};

export default ProjectCard;
