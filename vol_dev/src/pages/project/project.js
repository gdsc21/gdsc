import { useParams } from "react-router";
import { useState, useEffect } from 'react'

import axios from "axios";

const Project = () => {
	const [npInfo, setnpInfo] = useState("");
	const [Title, setTitle] = useState("");
	const [Description, setDescription] = useState("");
	const [DevProfiles, setDevProfiles] = useState("");
	const [GitHubRepo, setGitHubRepo] = useState("");

	// TODO: make id be a value passed to this component as a prop -- this function will run once the comp is rendered
	useEffect((id) => {
		const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-project"
		let { token } = JSON.parse(localStorage.getItem("user"))
		let config = {
			headers: { Authorization: `Bearer ${token}` },
			params: { projectId: id}
		}

		axios
			.get(url, config)
			.then((response) => {
				let data = response.data
				setnpInfo(data.npInfo)
				setTitle(data.title)
				setDescription(data.description)
				setDevProfiles(data.devProfiles)
				setGitHubRepo(data.GitHubRepo)
			})
			.catch((response) => {
				if (response.data.message === "Profile doesn't exists!") {} // TODO: Profile doesn't exist error handling
				else {
					// TODO: Server error handling
				}
			})
	}, [])

	let { id } = useParams();
	return (
		<div className="project">
			<h1>{id}</h1>
		</div>
	);
};

export default Project;
