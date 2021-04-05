// import Devproject from "./devproject";
import { Link } from "react-router-dom";

const Explore = ({ user, hamburgerClick }) => {
	// TODO: connect this component to the back end so that every user project is displayed here
	return (
		<div className="panel-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>
				<nav className="devNav">
					<Link to="/dashboard">
						<span className="navlink__text">Dashboard</span>
						<i className="navlink__icon fas fa-home"></i>
					</Link>
					<Link to="/notifications">
						<span className="navlink__text">Notifications</span>
						<i className="navlink__icon fas fa-bell"></i>
					</Link>
					{
						//TODO: add messaging
						/* <Link to="/">Messages</Link> */
					}
					<Link to="/explore">
						<span className="navlink__text">Explore</span>
						<i className="navlink__icon fas fa-compass"></i>
					</Link>
				</nav>
			</div>

			{/* Website projects */}
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
