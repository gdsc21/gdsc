import { Link } from "react-router-dom";
// import DevProfile from "./devProfile";
// import defaultNP from "./img/charity_icon.svg";
import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {authErrorCheck, getSessionStorageExpire} from "../../../utils";

const Project = ({ hamburgerClick }) => {

	let { id } = useParams();

	const [npInfo, setNpInfo] = useState("");
	const [prjTitle, setProjTitle] = useState("");
	const [projDescription, setProjDescription] = useState("");
	const [devProfiles, setDevProfiles] = useState("");
	const [projGithub, setProjGithub] = useState("");

	useEffect((id) => {
		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/projectApp/get-project";
		let token = getSessionStorageExpire("token");

		let config = {
			headers: { Authorization: `Bearer ${token}` },
			params: { projectId: id },
		};
		axios
			.get(url, config)
			.then((response) => {
				let data = response.data;
				setNpInfo(data.npInfo);
				setProjTitle(data.projTitle);
				setProjDescription(data.projDescription);
				setDevProfiles(data.devProfiles);
				setProjGithub(data.projGithub);
			})
			.catch((error) => {
				if (!error.response) console.log(error)
				else {
					if (error.response.data.message === "Profile doesn't exists!") {} // TODO: Profile doesn't exist error handling
					else {
						authErrorCheck(error)
					}
				}
			});
	}, []);

	return (
		<div className="panel-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>
				<div className="devNav">
					{
						//TODO: add messaging
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

			{/* <div className="proj-and-np">
				<div className="proj">
					<h3 className="title">Project Information</h3>
					<div className="project-info">
						<span className="proj-title">{title}</span>
						<span className="github">
							<a href={gitHubRepo}>
								<i class="fab fa-github"></i>
							</a>
						</span>
						<h4 className="subtitle">Description</h4>
						<p>{description}</p>
					</div>
				</div>
				<div className="np">
					<h3 className="title">Non-Profit Information</h3>
					<div className="non-profit">
						<img src={npInfo.npLogo || defaultNP} alt="" className="logo" />
						<h4>{npInfo.npDisplayName}</h4>
						<div className="np-links">
							{npInfo.npWebsite && (
								<a href={npInfo.npWebsite}>
									<i class="fas fa-globe"></i>
								</a>
							)}
							{npInfo.npEmail && (
								<a href={`mailto:${npInfo.npEmail}`}>
									<i class="fas fa-envelope"></i>
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
			<h3 className="title">Developers on this project</h3>
			<div className="developers">
				{Object.entries(devProfiles).map(([key, value]) => (
					<DevProfile user={value} />
				))}
			</div> */}
		</div>
	);
};

export default Project;
