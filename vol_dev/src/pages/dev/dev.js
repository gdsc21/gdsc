import Sidebar from "./Components/sidebar"
import userDetails from './Components/data/userDetails'
import ProjectPanel from "./Components/projectPanel"
import './styles/dev.css'
import { useState, useEffect } from 'react'
import axios from 'axios';

const Dev = () => {
	const user = userDetails
	const [hamburger, setHamburger] = useState(false);
	const [devDisplayName, setdevDisplayName] = useState("");
	const [devProfileImgUrl, setdevProfileImgUrl] = useState("");
	const [devLinks, setdevLinks] = useState("");
	const [devGamification, setdevGamification] = useState("");
	const [devProjects, setdevProjects] = useState("");
	const [devCommits, setdevCommits] = useState("");


	useEffect(() => {
		const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-dev-profile"
		let { token } = JSON.parse(localStorage.getItem("user"))
		let config = { headers: { Authorization: `Bearer ${token}`} }
		let data

		axios
			.get(url, config)
			.then((response) => {
				data = response.data
				setdevDisplayName(data.devDisplayName)
				setdevProfileImgUrl(data.devProfileImgUrl)
				setdevProjects(data.devProjects)
				setdevLinks(data.devLinks)
				setdevGamification(data.gamification)
			})
			.catch((err) => {

			})
	}, [])

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector(".sidebar");
		const hburger = document.querySelector(".hamburger");
		const panelContainer = document.querySelector(".panel-container")
		const hamclose = document.querySelector(".ham-close")
		if (hamburger) {
			sidebar.classList.remove("s-open");
			hburger.classList.remove("h-open");
			panelContainer.classList.remove("p-open")
			hamclose.classList.remove("c-open")
		} else {
			sidebar.classList.add("s-open");
			hburger.classList.add("h-open");
			panelContainer.classList.add("p-open")
			hamclose.classList.add("c-open")
		}
	};
	const [closeIcon, setHamClose] = useState(false);
	return (
		<div className="dev">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
			<Sidebar user={user[0]} hamCloseClick={hamburgerClick}/>
			<ProjectPanel user={user[0]} hamburger={hamburgerClick}/>
		</div>)
};

export default Dev;
