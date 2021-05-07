import "./styles/np.css";
import npicon from "./icons/np-icon.png";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Backend
import axios from "axios";
import { UserContext } from "../../store";
import { authErrorCheck, signOut, getSessionStorageExpire } from "../../utils";

// Components
import NpNavigation from "./components/NpNavigation";
import Loader from "../Components/loader";
import NpCreateProjectModal from "./components/NpCreateProjectModal";
import NpEditProfileModal from "./components/NpEditProfileModal";
import NpApplications from "./components/NpApplications";
import NpProjectModal from "./components/NpProjectModal";
import NpDashboard from "./components/NpDashboard";
import NpExplore from "./components/NpExplore";

const NonProfit = ({ page }) => {
	// Dummy user details for frontend tests
	// const user = require("./Components/data/userDetails").default;

	const {userStore, updateUserStore} = useContext(UserContext);
	const [hamburger, setHamburger] = useState(false);
	const [showCreateProject, setShowCreateProject] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);


	useEffect(() => {
		if (userStore) return;

		let counter = 1;
		const fetchProfile = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProfile);
			else ++counter;

			const url =
				"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/npApp/get-np";
			let token = getSessionStorageExpire("token");

			if (!token) {
				signOut()
				window.location.href = "/signin";
			}

			let config = {headers: {Authorization: `Bearer ${token}`}};
			let data;

			axios
				.get(url, config)
				.then((response) => {
					data = response.data;
					updateUserStore({type: "set", payload: data});
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
		return <Loader message="Hold on while we load your profile"/>
	} else {
		return (
			<div className="np-container">
				<button className="np-hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>

				<div className="np-sidebar">
					<button className="np-ham-close" onClick={hamburgerClick}>
						<i className="fas fa-times"></i>
					</button>
					<NpNavigation/>
				</div>

				<div className="np">
					<div className="np-dash">
						<NpCreateProjectModal
							showCreateProject={showCreateProject}
							setShowCreateProject={setShowCreateProject}
						/>
						<NpEditProfileModal
							showEditProfile={showEditProfile}
							setShowEditProfile={setShowEditProfile}
						/>
						<NpNavigation/>
						<div className="np-profile">
							<div className="np-profile-image">
								<img src={npicon} alt="Profile Picture"/>
								<div className="np-user">
									<h1>{userStore.npDisplayName}</h1>
								</div>
							</div>
							<Link to="/" onClick={signOut}>
								Sign Out
							</Link>
							<div className="np-create-edit-mobile" onClick={() => setShowCreateProject(true)}>
								<span>Create Project</span>
								<a href="/">
									<span>Edit Profile</span>
								</a>
							</div>
						</div>
						<div className="np-dash-option">
							<NpNavigation/>
							<div className="np-create-edit">
								<a onClick={() => setShowCreateProject(true)}>
									<span>Create Project</span>
								</a>
								<a onClick={() => setShowEditProfile(true)}>
									<span>Edit Profile</span>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div>
					{
						page === "Dashboard" ? <NpDashboard page={page} /> :
						page === "Explore" ? <NpExplore page={page} /> :
						page === "Applications" ? <NpApplications /> :
							<NpProjectModal />
					}
				</div>
			</div>
		)
	}
}

export default NonProfit;
