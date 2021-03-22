import { Link } from "react-router-dom";

const Devproject = ({ project }) => {
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

			<div className="progress">
				<h4>Progress</h4>
				<progress value={project.progress} max={100} />
				{project.progress}%
			</div>

			<Link className="goto-btn" to="/">
				Go to Page
			</Link>
		</div>
	);
};

export default Devproject;
