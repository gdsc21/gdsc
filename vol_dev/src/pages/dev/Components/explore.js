import Devproject from "./devproject";
import { Link } from "react-router-dom";

const Explore = ({ user, hamburger: hamburgerClick }) => {
    return ( 
		<div className="panel-container">
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
					<Link to="/">Messages</Link>
					<Link to="/explore">Explore</Link>
				</nav>
			</div>

			{/* Current user projects */}
			<div className="curProject">
				<h1 className="head">Upcoming Projects</h1>
				<div className="curProjectDisp">
					{user.projects.map((project, id) => {
						return <Devproject key={id} project={project} />;
					})}
				</div>
			</div>

		</div>
	);
}
 
export default Explore;