import { Link } from "react-router-dom";
import Devproject from "./devproject";
import userDetails from "./data/userDetails";
import npicon from "./icons/np-icon.png";
import {useContext, useEffect, useState} from "react";
import DevNav from "./devnav";
import { UserContext } from "../../../store";
import {authErrorCheck, getSessionStorageExpire} from "../../../utils";
import axios from "axios";

import CreateModal from "./createmodal";

const NP = ({ user }) => {
	const { userStore, updateUserStore } = useContext(UserContext)
	const [hamburger, setHamburger] = useState(false);

	useEffect(() => {
		if (userStore) return

		let counter = 1
		const fetchProfile = setInterval(() => {
			if (counter >= 3) clearInterval(fetchProfile)
			else ++counter

			const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-non-profit"
			let token = getSessionStorageExpire("token")
			let config = { headers: { Authorization: `Bearer ${token}` } }
			let data

			axios
				.get(url, config)
				.then((response) => {
					data = response.data
					updateUserStore({ type: "set", payload: data})
				})
				.then(() => {
					clearInterval(fetchProfile)
				})
				.catch((err) => {
					authErrorCheck(err)
				})
		}, 2000)
	}, [])

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector(".np-sidebar");
        const npdash = document.querySelector(".np")
        const hburger = document.querySelector(".np-hamburger");
		const hamclose = document.querySelector(".np-ham-close");
        const curproject = document.querySelector(".np-curProject")
        if (hamburger) {
            sidebar.classList.remove("s-open");
            npdash.classList.remove("n-open")
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
	const [closeIcon, setHamClose] = useState(false);
    return ( 
        <div className="np-container">
            <button className="np-hamburger" onClick={hamburgerClick}>
				<i className="fas fa-bars"></i>
			</button>
            <div className="np-sidebar">
                <button className="np-ham-close" onClick={hamburgerClick}>
                    <i class="fas fa-times"></i>
                </button>
                <DevNav />
            </div>
            <div className="np">
                <div className="np-dash">
                    <DevNav />
                    <div className="np-profile">
                        <div className="np-profile-image">
                            <img src={npicon} />
                            <div className="np-user">
                                <h1>Nick Miller</h1>
                                <h3>A Really Influential Non Profit</h3>
                            </div>
                        </div>
                        <a href="/"><span>Sign out</span></a>
                        <div className="np-create-edit-mobile">
                            <a href="/"><span>Create Project</span></a>
                            <a href="/"><span>Edit Profile</span></a>
                        </div>
                    </div>
                    <div className="np-dash-option">
                        <DevNav />
                        <div className="np-create-edit">
                            <a href="/"><span>Create Project</span></a>
                            <a href="/"><span>Edit Profile</span></a>
                        </div>
                    </div>
                </div>
            </div>
				<div className="np-curProject">
					{user.projects.map((project, id) => {
						return <Devproject key={id} project={project} />;
					})}
				</div>
        </div>
     );
}
 
export default NP;
