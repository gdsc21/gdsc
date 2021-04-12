import { Link } from "react-router-dom";
import { authErrorCheck, getSessionStorageExpire, signOut } from "../../../utils";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import DevProject from "./devProject";

const Explore = ({ hamburgerClick }) => {
	const [allProjectData, setAllProjectData] = useState(null);

	useEffect(() => {
		// requests a dev profile every 2 seconds until it succeeds or until 3 calls (6 seconds)
		let counter = 1;
		const fetchProjects = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProjects);
			else ++counter;

			const url =
				"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/projectApp/get-all-projects";
			let token = getSessionStorageExpire("token");

			if (!token) {
				signOut();
				window.location.href = "/signin";
			}

			let config = { headers: { Authorization: `Bearer ${token}` } };
			let data;

			axios
				.get(url, config)
				.then((response) => {
					data = response.data;
					setAllProjectData(data);

					// stops the loop
					clearInterval(fetchProjects);
				})
				.catch((err) => {
					console.log(err);
					if (err.response) authErrorCheck(err);
				});
		}, 2000);
	}, []);

	if (!allProjectData) {
		return <Loader message="Hold on while we load the available projects" />;
	} else {
		return (
			<div className="panel-container">
				{/* Nav and menu */}
				<div className="ham-header">
					<button className="hamburger" onClick={hamburgerClick}>
						<i className="fas fa-bars" />
					</button>
					<nav className="devNav">
						<Link to="/dashboard">
							<span className="navlink__text">Dashboard</span>
							<i className="navlink__icon fas fa-home" />
						</Link>
						<Link to="/notifications">
							<span className="navlink__text">Notifications</span>
							<i className="navlink__icon fas fa-bell" />
						</Link>
						{
							// TODO: add messaging
							// <Link to="/">Messages</Link>
						}
						<Link to="/explore">
							<span className="navlink__text">Explore</span>
							<i className="navlink__icon fas fa-compass" />
						</Link>
					</nav>
				</div>

				{/* Website projects */}
				<div className="curProject">
					<h1 className="head">Projects that need developers</h1>
					<div className="curProjectDisp">
						{Object.entries(allProjectData).map(([projectId, projectData], i) => (
							<DevProject projectId={projectId} projectData={projectData} explore={true} key={i} />
						))}
					</div>
				</div>
			</div>
		);
	}
};

export default Explore;
