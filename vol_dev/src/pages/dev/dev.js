import Sidebar from "./Components/sidebar";
import ProjectPanel from "./Components/projectPanel";
import "./styles/dev.css";
import { useState, useEffect } from "react";
import { getSessionStorageExpire } from "../../utils";
import axios from "axios";

const Dev = () => {
	// Dummy user details for frontend tests
	const user = require("./Components/data/userDetails").default;

	const [user1, setUser1] = useState(null);
	useEffect(() => {
		// TODO get user details from the user auth (from signing in) instead of get API call to enable instant render
		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-dev-profile";
		let token = getSessionStorageExpire("token");
		let config = { headers: { Authorization: `Bearer ${token}` } };
		let data;

		axios
			.get(url, config)
			.then((response) => {
				data = response.data;
				const deLinks = data.devLinks;
				const gamification = data.gamification;
				const fetchedUser = {
					name: data.devDisplayName,
					imgUrl: data.devProfileImgUrl,
					projects: data.devProjects,
				};
				console.log(data)
				setUser1(fetchedUser);
			})
			.catch((err) => {
				console.log(err)
			});
	}, []);

	const [hamburger, setHamburger] = useState(false);

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector(".sidebar");
		const hburger = document.querySelector(".hamburger");
		const panelContainer = document.querySelector(".panel-container");
		const hamclose = document.querySelector(".ham-close");
		if (hamburger) {
			sidebar.classList.remove("s-open");
			hburger.classList.remove("h-open");
			// panelContainer.classList.remove("p-open");
			hamclose.classList.remove("c-open");
		} else {
			sidebar.classList.add("s-open");
			hburger.classList.add("h-open");
			// panelContainer.classList.add("p-open");
			hamclose.classList.add("c-open");
		}
	};

	const [closeIcon, setHamClose] = useState(false);

	return (
		<div className="dev">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
				integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
				crossorigin="anonymous"
			/>

			<Sidebar user={user} hamCloseClick={hamburgerClick} />
			<ProjectPanel user={user} hamburger={hamburgerClick} />
		</div>
	);
};

export default Dev;
