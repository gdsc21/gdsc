import { Link } from "react-router-dom";
import DevProfile from "./devProfile";
import defaultNP from "./img/charity_icon.svg";

const ProjectPanel = ({ project, hamburger: hamburgerClick }) => {
	return (
		<div className="project-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>

				<nav className="devNav">
					{
						//TODO: add notifications and messaging
					}
					<Link to="/dashboard">Dashboard</Link>
					<Link to="/">Notifications</Link>
					<Link to="/explore">Explore</Link>
				</nav>
			</div>

			<div className="proj-and-np">
				<div className="proj">
					<h3 className="title">Project Information</h3>
					<div className="project-info">
						<span className="proj-title">{project.title}</span>
						<span className="github">
							<a href={project.gitHubRepo}>
								<i class="fab fa-github"></i>
							</a>
						</span>
						<h4 className="subtitle">Description</h4>
						<p>{project.description}</p>
					</div>
				</div>

				<div className="np">
					<h3 className="title">Non-Profit Information</h3>
					<div className="non-profit">
						<img src={project.npInfo.npLogo || defaultNP} alt="" className="logo" />

						<h4>{project.npInfo.npDisplayName}</h4>
						<div className="np-links">
							{project.npInfo.npWebsite && (
								<a href={project.npInfo.npWebsite}>
									<i class="fas fa-globe"></i>
								</a>
							)}
							{project.npInfo.npEmail && (
								<a href={`mailto:${project.npInfo.npEmail}`}>
									<i class="fas fa-envelope"></i>
								</a>
							)}
						</div>
					</div>
				</div>
			</div>

			<h3 className="title">Developers on this project</h3>
			<div className="developers">
				{Object.entries(project.devProfiles).map(([key, value]) => (
					<DevProfile user={value} />
				))}
			</div>
		</div>
	);
};

export default ProjectPanel;
