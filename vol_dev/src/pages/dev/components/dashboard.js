import DevProject from "./devProject";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../store";

const Dashboard = ({ hamburgerClick }) => {
	const { userStore } = useContext(UserContext);

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

					<Link to="/notifications">
						<span className="navlink__text">Notifications</span>
						<i className="navlink__icon fas fa-bell"></i>
					</Link>

					{
						//TODO: add messaging
						// <Link to="/">Messages</Link>
					}

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
					{Object.entries(userStore.devProjects).forEach(([projectId, projectData], i) => (
						<DevProject projectId={projectId} projectData={projectData} key={i} />
					))}
				</div>
			</div>

			{/* Projects that may interest the user */}
			{
				// TODO: add an algorithm that determines projects the user might be interested in
				// <div className="interestProject">
				// 	<h1 className="head">Projects that may interest you</h1>
				// 	<div className="intProjectDisp">
				// 		{user.interestProjects.map((project, id) => {
				// 			return <Devproject key={id} project={project} />;
				// 		})}
				// 	</div>
				// </div>
			}
		</div>
	);
};

export default Dashboard;
