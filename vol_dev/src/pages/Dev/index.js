import "./styles/dev.css";
import { useState, useEffect, useContext } from "react";

// Backend
import { authErrorCheck, getSessionStorageExpire, signOut } from "../../utils";
import axios from "axios";
import { UserContext } from "../../store";

// Components
<<<<<<< HEAD:vol_dev/src/pages/dev/index.js
import Sidebar from "./components/sidebar";
import Explore from "./components/explore";
import Project from "./components/project";
import Dashboard from "./components/dashboard";
import EditProfile from "./components/editProfile";
import Notifications from "./components/notifications";
import Loader from "../components/loader";
=======
import DevSidebar from "./Components/DevSidebar";
import DevProjectModal from "./Components/DevProjectModal";

import DevEditProfileModal from "./Components/DevEditProfileModal";
import Loader from "../Components/loader";
import DevProjectsLayout from "./Components/DevProjectsLayout";
>>>>>>> tim:vol_dev/src/pages/Dev/index.js

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
<<<<<<< HEAD:vol_dev/src/pages/dev/index.js
				<EditProfile showEditProfile={showEditProfile} setShowEditProfile={setShowEditProfile} />
=======
				<DevEditProfileModal
					showEditProfile={showEditProfile}
					setShowEditProfile={setShowEditProfile}
				/>
>>>>>>> tim:vol_dev/src/pages/Dev/index.js

				<DevSidebar
					user={userStore}
					hamCloseClick={hamburgerClick}
					setShowEditProfile={setShowEditProfile}
				/>
<<<<<<< HEAD:vol_dev/src/pages/dev/index.js

				{page === "dashboard" ? (
					<Dashboard user={userStore} hamburgerClick={hamburgerClick} />
				) : page === "explore" ? (
					<Explore user={userStore} hamburgerClick={hamburgerClick} />
				) : page === "notifications" ? (
					<Notifications hamburgerClick={hamburgerClick} />
				) : (
					<Project user={userStore} hamburgerClick={hamburgerClick} />
				)}
=======
				{
					page === "Project" ? <DevProjectModal hamburgerClick={hamburgerClick}/> :
						<DevProjectsLayout page={page} user={userStore} hamburgerClick={hamburgerClick}/>
				}
>>>>>>> tim:vol_dev/src/pages/Dev/index.js
			</div>
		);
	}
};

export default Dev;
