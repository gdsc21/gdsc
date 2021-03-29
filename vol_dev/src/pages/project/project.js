import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getSessionStorageExpire } from "../../utils";
import "./styles/project.css";

// Import panels
import Sidebar from "./Components/sidebar";
import ProjectPanel from "./Components/projectPanel";

import axios from "axios";

const Project = (props) => {
	// Dummy user and project details for frontend tests
	const user = require("./Components/data/userDetails").default;
	const project = require("./Components/data/dummyProject").default;

	// TODO: make id be a value passed to this component as a prop -- this function will run once the comp is rendered
	/*
	let { id } = useParams();
	
	const user = props.user;
	const [npInfo, setnpInfo] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [devProfiles, setDevProfiles] = useState("");
	const [gitHubRepo, setGitHubRepo] = useState("");
	
	useEffect((id) => {
		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-project";
		let token = getSessionStorageExpire("token");
		let config = {
			headers: { Authorization: `Bearer ${token}` },
			params: { projectId: id },
		};

		axios
			.get(url, config)
			.then((response) => {
				let data = response.data;
				setnpInfo(data.npInfo);
				setTitle(data.title);
				setDescription(data.description);
				setDevProfiles(data.devProfiles);
				setGitHubRepo(data.GitHubRepo);
			})
			.catch((response) => {
				if (response.data.message === "Profile doesn't exists!") {
				} // TODO: Profile doesn't exist error handling
				else {
					// TODO: Server error handling
				}
			});
	}, []);
	*/

	const [hamburger, setHamburger] = useState(false);

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector(".sidebar");
		const hburger = document.querySelector(".hamburger");
		const hamclose = document.querySelector(".ham-close");
		if (hamburger) {
			sidebar.classList.remove("s-open");
			hburger.classList.remove("h-open");
			hamclose.classList.remove("c-open");
		} else {
			sidebar.classList.add("s-open");
			hburger.classList.add("h-open");
			hamclose.classList.add("c-open");
		}
	};

	const [closeIcon, setHamClose] = useState(false);

	return (
		<div className="project">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
				integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
				crossorigin="anonymous"
			/>

			<Sidebar user={user} hamCloseClick={hamburgerClick} />
			<ProjectPanel project={project} hamburger={hamburgerClick} />
		</div>
	);
};

export default Project;
