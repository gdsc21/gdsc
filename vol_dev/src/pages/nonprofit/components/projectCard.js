import { Link } from "react-router-dom";

// projectId should be the projectID
const ProjectCard = ({ projectId, projectData }) => {
	// const projectURL = project.id ? `/project/${project.id}` : "/";
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

			{/*<div>*/}
			{/*	<h4>Role</h4>*/}
			{/*	<p className="role">{projectData.role}</p>*/}
			{/*</div>*/}

			{
				// TODO: Add a way to quantify the project's progess
				// <div className="progress">
				// 	<h4>Progress</h4>
				// 	<progress value={project.progress} max={100} />
				// 	{project.progress}%
				// </div>
				// TODO: Add a link that takes you to that project component which makes a request to get the project from its id
				// Currently, it takes you to the project's id, and ot the homepage if it's not there
			}

			<Link className="goto-btn" to={projectURL}>
				Go to Project
			</Link>
		</div>
	);
};

export default ProjectCard;
