import Sidebar from "./Components/sidebar";
import ProjectPanel from "./Components/projectPanel";
import "./styles/dev.css";
import { useState, useEffect, useContext } from "react";
import {authErrorCheck, getSessionStorageExpire, removeSessionStorage} from "../../utils";
import { fbApp } from "../../firebase";
import axios from "axios";
import { UserContext } from "../../store";
import Modal from "../components/modal";
import EditProfile from "./Components/EditProfile";

const Dev = () => {
	const { userStore, updateUserStore } = useContext(UserContext)

	useEffect(() => {
		if (userStore) return

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
					updateUserStore({ type: "set", payload: data})
				})
				.then(() => {
					// stops the loop
					clearInterval(fetchProfile);
				})
				.catch((err) => {
					authErrorCheck(err)
				});
		}, 2000);
	}, []);

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

	if (!userStore) {
		return (
			<div className="dev__loader">
				<svg
					width="140"
					height="71"
					viewBox="0 0 140 71"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M29.709 23.9439L29.5215 27.8579C28.9278 27.7798 28.3653 27.7407 27.834 27.7407C26.7247 27.7407 25.8262 27.8501 25.1387 28.0689C24.4512 28.2876 23.9278 28.6626 23.5684 29.1939C23.2247 29.7251 22.9903 30.3345 22.8653 31.022C22.7559 31.6939 22.7012 32.6001 22.7012 33.7407C22.7012 34.3814 22.7247 35.3189 22.7715 36.5532C22.834 37.7876 22.8653 38.6704 22.8653 39.2017V50.2407H18.2481V24.5298H22.4434L22.9122 27.4126C23.3965 26.2876 24.1309 25.4204 25.1153 24.8111C26.0997 24.1861 27.2793 23.8736 28.6543 23.8736C28.9981 23.8736 29.3497 23.897 29.709 23.9439ZM54.7637 37.022C52.8887 37.2095 51.7247 37.3189 51.2715 37.3501H38.4981C38.5137 39.6157 38.5762 42.1001 38.6856 44.8032C38.7637 45.8501 39.209 46.5454 40.0215 46.8892C40.8497 47.2173 42.4512 47.3814 44.8262 47.3814C45.7168 47.3814 46.4825 47.3501 47.1231 47.2876C47.7637 47.2095 48.2793 47.0845 48.67 46.9126C49.0762 46.7251 49.3887 46.5532 49.6075 46.397C49.8418 46.2251 50.0137 45.9673 50.1231 45.6236C50.2325 45.2642 50.3028 44.9673 50.334 44.7329C50.3653 44.4829 50.3965 44.1157 50.4278 43.6314C50.459 43.1314 50.4981 42.7251 50.545 42.4126L54.1309 43.0689C54.0997 44.1626 54.0215 45.0923 53.8965 45.8579C53.7715 46.6079 53.5606 47.272 53.2637 47.8501C52.9668 48.4282 52.6153 48.8892 52.209 49.2329C51.8028 49.5611 51.2559 49.8345 50.5684 50.0532C49.8809 50.272 49.1231 50.4126 48.295 50.4751C47.4668 50.5532 46.4434 50.5923 45.2247 50.5923C43.6622 50.5923 42.3028 50.4986 41.1465 50.3111C39.9903 50.1392 38.9981 49.9204 38.17 49.6548C37.3575 49.3892 36.6856 48.9595 36.1543 48.3657C35.6231 47.7564 35.2012 47.1782 34.8887 46.6314C34.5918 46.0845 34.3731 45.2798 34.2325 44.2173C34.0918 43.1548 33.9981 42.1939 33.9512 41.3345C33.92 40.4595 33.9043 39.2564 33.9043 37.7251C33.9043 35.5689 33.9278 33.8892 33.9747 32.6861C34.0372 31.4829 34.1934 30.2798 34.4434 29.0767C34.6934 27.8579 35.0293 26.9751 35.4512 26.4282C35.8731 25.8814 36.4981 25.3736 37.3262 24.9048C38.1543 24.4361 39.1309 24.1392 40.2559 24.0142C41.3809 23.8736 42.8106 23.8032 44.545 23.8032C45.7481 23.8032 46.7872 23.8423 47.6622 23.9204C48.5372 23.9829 49.3418 24.1236 50.0762 24.3423C50.8106 24.5611 51.4122 24.8111 51.8809 25.0923C52.3653 25.3736 52.7872 25.7876 53.1465 26.3345C53.5215 26.8814 53.8028 27.4517 53.9903 28.0454C54.1934 28.6236 54.3575 29.397 54.4825 30.3657C54.6075 31.3345 54.6856 32.3189 54.7168 33.3189C54.7481 34.3032 54.7637 35.5376 54.7637 37.022ZM38.5215 34.8892H50.1465C50.1153 32.8892 50.0372 31.0611 49.9122 29.4048C49.8497 28.4517 49.4356 27.8189 48.67 27.5064C47.92 27.1782 46.5372 27.0142 44.5215 27.0142C42.2872 27.0142 40.8731 27.1392 40.2793 27.3892C40.0137 27.4673 39.7793 27.6079 39.5762 27.8111C39.3887 27.9986 39.2325 28.272 39.1075 28.6314C38.9825 28.9907 38.8809 29.3267 38.8028 29.6392C38.7403 29.9517 38.6856 30.3892 38.6387 30.9517C38.6075 31.4986 38.584 31.9282 38.5684 32.2407C38.5528 32.5376 38.5372 32.9986 38.5215 33.6236C38.5215 34.2486 38.5215 34.6704 38.5215 34.8892ZM65.8497 50.2407H61.2325V15.4126L65.8497 15.0376V50.2407ZM78.0137 50.2407H73.3965V24.5298H78.0137V50.2407ZM78.0137 14.5923V18.647H73.3965V14.5923H78.0137ZM95.6153 46.9829L95.5215 50.2642C94.209 50.4829 93.0215 50.5923 91.959 50.5923C90.8184 50.5923 89.8731 50.4673 89.1231 50.2173C88.3887 49.9673 87.834 49.5689 87.459 49.022C87.084 48.4751 86.8262 47.8736 86.6856 47.2173C86.545 46.5454 86.4747 45.6939 86.4747 44.6626V27.1548H82.9825V24.5298H86.4747V17.2173L91.0684 16.8423V24.5298H95.8028V27.1548H91.0684V43.0923C91.0684 44.7798 91.1465 45.8736 91.3028 46.3736C91.4747 46.8736 91.9278 47.1236 92.6622 47.1236C93.3809 47.1236 94.3653 47.0767 95.6153 46.9829ZM121.795 37.022C119.92 37.2095 118.756 37.3189 118.303 37.3501H105.529C105.545 39.6157 105.607 42.1001 105.717 44.8032C105.795 45.8501 106.24 46.5454 107.053 46.8892C107.881 47.2173 109.482 47.3814 111.857 47.3814C112.748 47.3814 113.514 47.3501 114.154 47.2876C114.795 47.2095 115.311 47.0845 115.701 46.9126C116.107 46.7251 116.42 46.5532 116.639 46.397C116.873 46.2251 117.045 45.9673 117.154 45.6236C117.264 45.2642 117.334 44.9673 117.365 44.7329C117.397 44.4829 117.428 44.1157 117.459 43.6314C117.49 43.1314 117.529 42.7251 117.576 42.4126L121.162 43.0689C121.131 44.1626 121.053 45.0923 120.928 45.8579C120.803 46.6079 120.592 47.272 120.295 47.8501C119.998 48.4282 119.647 48.8892 119.24 49.2329C118.834 49.5611 118.287 49.8345 117.6 50.0532C116.912 50.272 116.154 50.4126 115.326 50.4751C114.498 50.5532 113.475 50.5923 112.256 50.5923C110.693 50.5923 109.334 50.4986 108.178 50.3111C107.022 50.1392 106.029 49.9204 105.201 49.6548C104.389 49.3892 103.717 48.9595 103.186 48.3657C102.654 47.7564 102.232 47.1782 101.92 46.6314C101.623 46.0845 101.404 45.2798 101.264 44.2173C101.123 43.1548 101.029 42.1939 100.982 41.3345C100.951 40.4595 100.936 39.2564 100.936 37.7251C100.936 35.5689 100.959 33.8892 101.006 32.6861C101.068 31.4829 101.225 30.2798 101.475 29.0767C101.725 27.8579 102.061 26.9751 102.482 26.4282C102.904 25.8814 103.529 25.3736 104.357 24.9048C105.186 24.4361 106.162 24.1392 107.287 24.0142C108.412 23.8736 109.842 23.8032 111.576 23.8032C112.779 23.8032 113.818 23.8423 114.693 23.9204C115.568 23.9829 116.373 24.1236 117.107 24.3423C117.842 24.5611 118.443 24.8111 118.912 25.0923C119.397 25.3736 119.818 25.7876 120.178 26.3345C120.553 26.8814 120.834 27.4517 121.022 28.0454C121.225 28.6236 121.389 29.397 121.514 30.3657C121.639 31.3345 121.717 32.3189 121.748 33.3189C121.779 34.3032 121.795 35.5376 121.795 37.022ZM105.553 34.8892H117.178C117.147 32.8892 117.068 31.0611 116.943 29.4048C116.881 28.4517 116.467 27.8189 115.701 27.5064C114.951 27.1782 113.568 27.0142 111.553 27.0142C109.318 27.0142 107.904 27.1392 107.311 27.3892C107.045 27.4673 106.811 27.6079 106.607 27.8111C106.42 27.9986 106.264 28.272 106.139 28.6314C106.014 28.9907 105.912 29.3267 105.834 29.6392C105.772 29.9517 105.717 30.3892 105.67 30.9517C105.639 31.4986 105.615 31.9282 105.6 32.2407C105.584 32.5376 105.568 32.9986 105.553 33.6236C105.553 34.2486 105.553 34.6704 105.553 34.8892Z"
						fill="white"
					/>
					<line
						x1="120.859"
						y1="55.0601"
						x2="101.229"
						y2="55.0601"
						stroke="white"
						strokeWidth="4"
					/>
					<rect
						x="2.93902"
						y="3.89777"
						width="134.119"
						height="64.2751"
						rx="12"
						stroke="white"
						strokeWidth="4"
					/>
				</svg>

				<h3>Hold on while we get your profile</h3>
			</div>
		);
	} else {
		return (
			<div className="developer__dashboard">
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
					integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
					crossOrigin="anonymous"
				/>
				<Modal open={showEditProfile} setOpen={setShowEditProfile} title="Edit Profile">
					<EditProfile user={userStore} setShowEditProfile={setShowEditProfile} />
				</Modal>
				<Sidebar
					user={userStore}
					hamCloseClick={hamburgerClick}
					setShowEditProfile={setShowEditProfile}
				/>
				<ProjectPanel user={userStore} hamburger={hamburgerClick} />
			</div>
		);
	}


};

export default Dev;
