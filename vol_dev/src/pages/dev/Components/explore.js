import Devproject from "./devproject";
import { Link } from "react-router-dom";

const Explore = ({ user, hamburgerClick }) => {
	// TODO: add current projects on the site

	return (
		<div className="panel-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>
				<div className="devNav">
					<Link to="/dashboard">
						<span className="navlink__text">Dashboard</span>
						<i className="navlink__icon fas fa-home"></i>
					</Link>
					{
						//TODO: add notifications and messaging
						/* <Link to="/">
							<span className="navlink__text">Notifications</span>
							<i className="navlink__icon fas fa-bell"></i>
						</Link>
						<Link to="/">Messages</Link> */
					}
					<Link to="/explore">
						<span className="navlink__text">Explore</span>
						<i className="navlink__icon fas fa-compass"></i>
					</Link>
				</div>
			</div>

			{/* Current user projects */}
			<div className="curProject">
				<h1 className="head">Projects that need developers</h1>
				<div className="curProjectDisp">
					{/* {user.projects.map((project, id) => {
						return <Devproject key={id} project={project} />;
					})} */}
				</div>
			</div>
		</div>
	);
};

export default Explore;
