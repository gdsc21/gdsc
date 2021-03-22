import Devproject from "./devproject";
import { Carousel } from "./carousel";

const ProjectPanel = ({ user, hamburger: hamburgerClick }) => {
	return (
		<div className="panel-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>
				<nav className="devNav">
					<a href="/">Dashboard</a>
					<a href="/">Notifications</a>
					<a href="/">Messages</a>
					<a href="/">Explore</a>
				</nav>
			</div>

			{/* Current user projects */}
			<div className="curProject">
				<h1 className="head">Current Projects</h1>
				<Carousel show={3}>
					{user.projects.map((project, id) => {
						return <Devproject key={id} project={project} />;
					})}
				</Carousel>
			</div>

			{/* Projects that may interest the user */}
			<div className="interestProject">
				<h1 className="head">Projects that may interest you</h1>
				<div className="intProjectDisp">
					{user.interestProjects.map((project, id) => {
						return <Devproject key={id} project={project} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default ProjectPanel;
