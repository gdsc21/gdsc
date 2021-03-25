import { Link } from "react-router-dom";

const Devproject = ({ project }) => {
	const projectURL = project.id ? `/project/${project.id}` : "/";

	return (
		<div className="devproject">
			<h3>{project.org}</h3>
			<div>
				<h4>Title</h4>
				<p className="title">{project.title}</p>
			</div>

			<div className="description-div">
				<h4>Description</h4>
				<p className="description">{project.title}</p>
			</div>

			<div>
				<h4>Role</h4>
				<p className="role">{project.role}</p>
			</div>

			{
				// TODO: Add a way to quantify the project's progess
				// <div className="progress">
				// 	<h4>Progress</h4>
				// 	<progress value={project.progress} max={100} />
				// 	{project.progress}%
				// </div>
				// TODO: Add a link that takes you to that project's page //
				// Currently, it takes you to the project's id, and ot the homepage if it's not there
			}

			<Link className="goto-btn" to={projectURL}>
				Go to Project
			</Link>
		</div>
	);
};

export default Devproject;
