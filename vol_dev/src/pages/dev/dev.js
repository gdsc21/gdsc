import Sidebar from "./Components/sidebar";
import ProjectPanel from "./Components/projectPanel";
import "./styles/dev.css";
import {useState, useEffect, useContext} from "react";
import { Redirect } from "react-router-dom";
import { getSessionStorageExpire } from "../../utils";
import axios from "axios";
import { Context } from "../../store";

const Dev = () => {
	const [user, setUser] = useState(null);
	const { store, dispatch } = useContext(Context)

	useEffect(() => {
		if (store) return

		// requests a dev profile every 2 seconds until it succeeds or until 3 calls (6 seconds)
		let counter = 1
		const fetchProfile = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProfile)
			else ++counter

			const url =
				"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-dev-profile";
			let token = getSessionStorageExpire("token");
			let config = { headers: { Authorization: `Bearer ${token}` } };
			let data;

			axios
				.get(url, config)
				.then((response) => {
					data = response.data;
					console.log(data)
					dispatch({ type: "set", payload: data})
					setUser(data);
				})
				.then(() => {
					// stops the loop
					clearInterval(fetchProfile)
				})
				.catch((err) => {
					console.log(err)
					if (err.statusCode === 403) {
						// TODO: Enable automatic token refresh if user is still active
						return <Redirect to="/signin"/>
					}
				});
		}, 2000)

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

	if (!store) {
		return (
			<div>
				<h1>Hold on while we get your profile</h1>
			</div>
		)
	} else {
		return (
			<div className="dev">
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
					integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
					crossOrigin="anonymous"
				/>

				<Sidebar user={store} hamCloseClick={hamburgerClick} />
				<ProjectPanel user={store} hamburger={hamburgerClick} />
			</div>
		);
	}


};

export default Dev;
