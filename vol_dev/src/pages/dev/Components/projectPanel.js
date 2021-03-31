import Devproject from "./devproject";
import { Link } from "react-router-dom";

const ProjectPanel = ({ user, hamburger: hamburgerClick }) => {
	return (
		<div className="panel-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>
				<div className="devNav">
					{
						//TODO: add notifications and messaging
					}
					<Link to="/dashboard">
						<span className="navlink__text">Dashboard</span>
						<i className="navlink__icon fas fa-home"></i>
					</Link>
					<Link to="/">
						<span className="navlink__text">Notifications</span>
						<i className="navlink__icon fas fa-bell"></i>
					</Link>
					{/* <Link to="/">Messages</Link> */}
					<Link to="/explore">
						<span className="navlink__text">Explore</span>
						<i className="navlink__icon fas fa-compass"></i>
					</Link>
				</div>
			</div>

			{/* Current user projects */}
			<div className="curProject">
				<h1 className="head">Current Projects</h1>
				<div className="curProjectDisp">
					{user.projects &&
						Object.entries(user.projects).map(([projID, projInfo], id) => {
							return <Devproject key={id} project={projInfo} />;
						})}
				</div>
			</div>

			{
				//TODO: add an algorithm that determines projects the user might be interested in
				/* Projects that may interest the user 
			<div className="interestProject">
				<h1 className="head">Projects that may interest you</h1>
				<div className="intProjectDisp">
					{user.interestProjects.map((project, id) => {
						return <Devproject key={id} project={project} />;
					})}
				</div>
			</div>
			*/
			}
		</div>
	);
};

export default ProjectPanel;
