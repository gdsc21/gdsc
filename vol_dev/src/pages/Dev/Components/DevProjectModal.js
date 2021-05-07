import { useParams } from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {getSessionStorageExpire, signOut} from "../../../utils";
import Loader from "../../Components/loader";
import DevProfileCard from "./DevProfileCard";
import DevNavigation from "./DevNavigation";

const DevProjectModal = ({ hamburgerClick }) => {
	let { id } = useParams();
	const [projectData, setProjectData] = useState(undefined)

	useEffect(() => {
		const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/projectApp/get-project";
		// const url = "http://localhost:5001/sunlit-webbing-305321/us-central1/projectApp/get-project"

		let token = getSessionStorageExpire("token");
		if (!token) {
			signOut()
			window.location.href = "/signin";
		}

		let config = {
			headers: { Authorization: `Bearer ${token}` },
			params: { projectId: id },
		};
		axios
			.get(url, config)
			.then((response) => {
				if (response.data) setProjectData(response.data)
			})
			.catch((error) => {
				if (error) {
					console.error(error.response)
				}
				else {
				}
			});
	}, [id]);

	if (!projectData) {
		return <Loader message="Hold on while we load the project" />;
	} else {
		let devProfileCards = []
		Object.entries(projectData.devProfiles).forEach(([devUid, devProfile]) => {
			devProfileCards.push(<DevProfileCard devUid={devUid} devProfile={devProfile} />)
		})

		return (
			<div className="panel-container">
				<DevNavigation hamburgerClick={hamburgerClick} />
				<div className="proj-and-np">
					<div className="proj">
						<h3 className="title">DevProjectModal Information</h3>
						<div className="project-info">
							<span className="proj-title">{projectData.projTitle}</span>
							<span className="github">
							<a href={projectData.projGithub}>
								<i class="fab fa-github"></i>
							</a>
						</span>
							<h4 className="subtitle">Description</h4>
							<p>{projectData.projDescription}</p>
						</div>
					</div>
					<div className="np">
						<h3 className="title">Non-Profit Information</h3>
						<div className="non-profit">
							{/*<img src={} alt="" className="logo" />*/}
							<h4>{projectData.npInfo.npDisplayName}</h4>
							<div className="np-links">
								{projectData.npInfo.npWebsite && (
									<a href={projectData.npInfo.npWebsite}>
										<i class="fas fa-globe"></i>
									</a>
								)}
								{projectData.npInfo.npEmail && (
									<a href={`mailto:${projectData.npInfo.npEmail}`}>
										<i class="fas fa-envelope"></i>
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
				<h3 className="title">Developers on this project</h3>
				<div className="developers">
					{devProfileCards}
				</div>
			</div>
		);
	}
};

export default DevProjectModal;
