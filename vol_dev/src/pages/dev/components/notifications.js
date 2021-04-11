import { Link } from "react-router-dom";
import { authErrorCheck, getSessionStorageExpire, signOut } from "../../../utils";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import DevApplication from "./devApplication";

const Notifications = ({ hamburgerClick }) => {
	const [applicationData, setApplicationData] = useState(null);

	useEffect(() => {
		// requests a dev profile every 2 seconds until it succeeds or until 3 calls (6 seconds)
		let counter = 1;
		const fetchProjects = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProjects);
			else ++counter;

			const url =
				"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/dev-get-applications";
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
					console.log(data);
					setApplicationData(data);
					// stops the loop
					clearInterval(fetchProjects);
				})
				.then(() => {})
				.catch((err) => {
					authErrorCheck(err);
				});
		}, 2000);
	}, []);

	if (!applicationData) {
		return <Loader message="Hold on while we fetch your notifications" />;
	} else {
		let projectCards = [];
		Object.entries(applicationData).forEach(([projectId, projectData]) => {
			projectCards.push(<DevApplication projectId={projectId} projectData={projectData} />);
		});

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
					<h1 className="head">Your Applications</h1>
					<div className="curProjectDisp">{projectCards}</div>
				</div>
			</div>
		);
	}
};

export default Notifications;
