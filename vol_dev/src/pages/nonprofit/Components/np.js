import { Link } from "react-router-dom";
import { Carousel } from "./carousel";
import Devproject from "./devproject";
import userDetails from "./data/userDetails";
import npicon from "../icons/np-icon.png";
import { useState } from "react";
import DevNav from "./devnav";

const NP = ({ user }) => {
	const [hamburger, setHamburger] = useState(false);

	const hamburgerClick = () => {
		setHamburger(!hamburger);

		const sidebar = document.querySelector(".sidebar");
		const npdash = document.querySelector(".np");
		const hburger = document.querySelector(".hamburger");
		const hamclose = document.querySelector(".ham-close");
		if (hamburger) {
			sidebar.classList.remove("s-open");
			npdash.classList.remove("n-open");
			hburger.classList.remove("h-open");
			hamclose.classList.remove("c-open");
		} else {
			sidebar.classList.add("s-open");
			npdash.classList.add("n-open");
			hburger.classList.add("h-open");
			hamclose.classList.add("c-open");
		}
	};

	const [closeIcon, setHamClose] = useState(false);
	return (
		<div className="container">
			<button className="hamburger" onClick={hamburgerClick}>
				<i className="fas fa-bars"></i>
			</button>
			<div className="sidebar">
				<button className="ham-close" onClick={hamburgerClick}>
					<i class="fas fa-times"></i>
				</button>
				<DevNav />
			</div>
			<div className="np">
				<div className="np-dash">
					<DevNav />
					<div className="profile">
						<div className="profile-image">
							<img src={npicon} />
							<div className="user">
								<h1>Nick Miller</h1>
								<h3>A Really Influential Non Profit</h3>
							</div>
						</div>
						<a href="/">
							<span>Sign out</span>
						</a>
						<div className="create-edit-mobile">
							<a href="/">
								<span>Create Project</span>
							</a>
							<a href="/">
								<span>Edit Profile</span>
							</a>
						</div>
					</div>
					<div className="dash-option">
						<DevNav />
						<div className="create-edit">
							<a href="/">
								<span>Create Project</span>
							</a>
							<a href="/">
								<span>Edit Profile</span>
							</a>
						</div>
					</div>
				</div>
				<div className="carousel-3">
					<Carousel show={3} infiniteLoop={false}>
						{user.projects.map((project, id) => {
							return <Devproject key={id} project={project} />;
						})}
					</Carousel>
				</div>
				<div className="carousel-1">
					<Carousel show={1} infiniteLoop={false}>
						{user.projects.map((project, id) => {
							return <Devproject key={id} project={project} />;
						})}
					</Carousel>
				</div>
			</div>
		</div>
	);
};

export default NP;
