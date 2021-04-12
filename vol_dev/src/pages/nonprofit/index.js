import "./styles/np.css";
import npicon from "./icons/np-icon.png";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Backend
import axios from "axios";
import { UserContext } from "../../store";
import { authErrorCheck, signOut, getSessionStorageExpire } from "../../utils";

// Components
import ProjectCard from "./components/projectCard";
import Navigation from "./components/navigation";
import Loader from "../components/loader";
import CreateProject from "./components/createProject";
import EditProfile from "./components/editProfile";
import Notifications from "./components/notifications";
import { Redirect } from "react-router";

const NonProfit = ({ page }) => {
	const { userStore, updateUserStore } = useContext(UserContext);
	const [hamburger, setHamburger] = useState(false);
	const [showCreateProject, setShowCreateProject] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);

	useEffect(() => {
		if (userStore) return;

		let counter = 1;
		const fetchProfile = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProfile);
			else ++counter;

			const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/npApp/get-np";
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
					updateUserStore({ type: "set", payload: data });
				})
				.then(() => {
					clearInterval(fetchProfile);
				})
				.catch((err) => {
					if (counter < 3) {
					} else authErrorCheck(err);
				});
		}, 2000);
	}, []);

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector(".np-sidebar");
		const npdash = document.querySelector(".np");
		const hburger = document.querySelector(".np-hamburger");
		const hamclose = document.querySelector(".np-ham-close");
		const curproject = document.querySelector(".np-curProject");
		if (hamburger) {
			sidebar.classList.remove("s-open");
			npdash.classList.remove("n-open");
			hburger.classList.remove("h-open");
			hamclose.classList.remove("c-open");
			curproject.classList.remove("p-open");
		} else {
			sidebar.classList.add("s-open");
			npdash.classList.add("n-open");
			hburger.classList.add("h-open");
			hamclose.classList.add("c-open");
			curproject.classList.add("p-open");
		}
	};

	if (!userStore) {
		return <Loader message="Hold on while we load your profile" />;
	} else {
		return (
			<div className="np__dashboard">
				<CreateProject
					showCreateProject={showCreateProject}
					setShowCreateProject={setShowCreateProject}
				/>

				<EditProfile showEditProfile={showEditProfile} setShowEditProfile={setShowEditProfile} />

				<button className="np-hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>

				<div className="np-sidebar">
					<button className="np-ham-close" onClick={hamburgerClick}>
						<i className="fas fa-times"></i>
					</button>
					<Navigation />
				</div>

				<div className="np-dash">
					<Navigation />

					<div className="np-profile">
						<div className="np__profileInfo">
							<img src={npicon} />

							<h2 className="np__username">{userStore.npDisplayName}</h2>
						</div>

						<Link className="np__signout" to="/" onClick={signOut}>
							Sign Out
						</Link>

						<div className="np-create-edit-mobile" onClick={() => setShowCreateProject(true)}>
							<a>Create Project</a>
							<a>Edit Profile</a>
						</div>
					</div>

					<div className="np-dash-option">
						<Navigation />
						<div className="np-create-edit">
							<a onClick={() => setShowCreateProject(true)}>Create Project</a>

							<a onClick={() => setShowEditProfile(true)}>Edit Profile</a>
						</div>
					</div>
				</div>

				{page === "dashboard" ? (
					<div className="np-curProject">
						{Object.entries(userStore.npProjects).map(([projectId, projectData]) => (
							<ProjectCard projectId={projectId} projectData={projectData} />
						))}
					</div>
				) : page === "explore" ? (
					<div className="np__comingSoon">Coming Soon</div>
				) : (
					page === "notifications" && <Notifications />
				)}
			</div>
		);
	}
};

export default NonProfit;
