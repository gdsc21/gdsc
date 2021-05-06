import "./styles/dev.css";
import { useState, useEffect, useContext } from "react";

// Backend
import {authErrorCheck, getSessionStorageExpire, signOut} from "../../utils";
import axios from "axios";
import { UserContext } from "../../store";

// Components
import DevSidebar from "./Components/DevSidebar";
import DevProjectModal from "./Components/DevProjectModal";

import DevEditProfileModal from "./Components/DevEditProfileModal";
import Loader from "../Components/loader";
import DevProjectsLayout from "./Components/DevProjectsLayout";

const Dev = ({ page }) => {
	const { userStore, updateUserStore } = useContext(UserContext);

	useEffect(() => {
		if (userStore) return;

		// requests a Dev profile every 2 seconds until it succeeds or until 3 calls (6 seconds)
		let counter = 1;
		const fetchProfile = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProfile);
			else ++counter;

			const url =
				"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/devApp/get-dev-profile";
			let token = getSessionStorageExpire("token");

			if (!token) {
				signOut()
				window.location.href = "/signin";
			}

			let config = { headers: { Authorization: `Bearer ${token}` } };
			let data;

			axios
				.get(url, config)
				.then((response) => {
					data = response.data;
					console.log(data);
					updateUserStore({ type: "set", payload: data });
				})
				.then(() => {
					// stops the loop
					clearInterval(fetchProfile);
				})
				.catch((err) => {
					authErrorCheck(err);
				});
		}, 2000);
	}, []);

	// UI state
	const [hamburger, setHamburger] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector("#developer__sidebar");
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

	if (!userStore) {
		return <Loader message="Hold on while we get your profile" />;
	} else {
		return (
			<div className="developer__dashboard">
				<DevEditProfileModal
					showEditProfile={showEditProfile}
					setShowEditProfile={setShowEditProfile}
				/>

				<DevSidebar
					user={userStore}
					hamCloseClick={hamburgerClick}
					setShowEditProfile={setShowEditProfile}
				/>
				{
					page === "Project" ? <DevProjectModal hamburgerClick={hamburgerClick}/> :
						<DevProjectsLayout page={page} user={userStore} hamburgerClick={hamburgerClick}/>
				}
			</div>
		);
	}
};

export default Dev;
