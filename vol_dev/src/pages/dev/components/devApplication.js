const DevApplication = ({ projectData }) => {
	return (
		<div className="devproject">
			<h3>{projectData.npDisplayName}</h3>

			<div>
				<h4>Title</h4>
				<p className="title">{projectData.projTitle}</p>
			</div>

			<div className="description-div">
				<h4>Description</h4>
				<p className="description">{projectData.projDescription}</p>
			</div>

			<div className="dev-application-status">
				<h4>Status</h4>
				<p className="description">{projectData.appStatus || "Pending"}</p>
			</div>

			{
				// TODO: There are no roles for projects yet but we need to add the github repo link and the non-profits name
				// <div>
				// 	<h4>Role</h4>
				// 	<p className="role">{project.role}</p>
				// </div>
			}

			{
				// TODO: Add a way to quantify the project's progess
				// <div className="progress">
				// 	<h4>Progress</h4>
				// 	<progress value={project.progress} max={100} />
				// 	{project.progress}%
				// </div>
			}
		</div>
	);
};

export default DevApplication;
