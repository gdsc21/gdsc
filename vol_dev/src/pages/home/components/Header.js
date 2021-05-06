import React, { useState } from "react";
import { Link as ScrollTo } from "react-scroll";
import { Link } from "react-router-dom";

// Upload images
import logo from "../img/logo.svg";
import gitLogo from "../img/gitLogo.png";
import projectLogo from "../img/projectLogo.png";
import pointLogo from "../img/pointLogo.png";
import msgLogo from "../img/msgLogo.png";
import abstract from "../img/abstract.svg";

// Upload data
import projectData from "./featureProjectData";

// Upload css
import "../styles/homepage.css";

const Header = () => {
	const images = [
		{
			img: gitLogo,
			description: "embedded github collaboration",
			alt: "github logo",
		},
		{
			img: projectLogo,
			description: "integrated project management",
			alt: "agile project workflow",
		},
		{
			img: pointLogo,
			description: "point granting && redemption",
			alt: "circles and dots",
		},
		{
			img: msgLogo,
			description: "individual && group messaging",
			alt: "chatbox icon",
		},
	];

	const [hamburger, setHamburger] = useState(false);

	const handleHamburger = () => {
		setHamburger(!hamburger);

		const menu = document.querySelector(".navlinks");
		const hburger = document.querySelector(".hamburger");
		if (hamburger) {
			menu.classList.remove("open");
			hburger.classList.remove("open");
		} else {
			menu.classList.add("open");
			hburger.classList.add("open");
		}
	};

	return (
		<div className="home__header">
			<nav className="nav">
				<div className="logo">
					<img src={logo} alt="website logo"></img>
				</div>

				<div className="hamburger" onClick={() => handleHamburger()}>
					<div className="line" id="hamburger-line1"></div>
					<div className="line" id="hamburger-line2"></div>
					<div className="line" id="hamburger-line3"></div>
				</div>

				<div className="navlinks">
					<ScrollTo id="homepage-navlink-home" className="link main-links" to="home" smooth={true}>
						home
					</ScrollTo>
					<ScrollTo
						id="homepage-navlink-explore"
						className="link main-links"
						to="explore"
						smooth={true}
					>
						explore
					</ScrollTo>
					<ScrollTo
						id="homepage-navlink-sponsors"
						className="link main-links"
						to="sponsors"
						smooth={true}
					>
						sponsors
					</ScrollTo>
					<ScrollTo
						id="homepage-navlink-contact"
						className="link main-links"
						to="contact"
						smooth={true}
					>
						contact
					</ScrollTo>
					<Link id="homepage-navlink-signin" className="link btn" to="/signin">
						sign in
					</Link>
					<Link id="homepage-navlink-signup" className="link signup-btn btn" to="/signup">
						sign up
					</Link>
				</div>
			</nav>
			<div name="home" className="info">
				<div className="text">
					<h1>WELCOME TO SOMETHING GREAT.</h1>
					<h2>A chance for non-profits to expand digitally, a chance for developers to do good.</h2>
					<p>
						At ReLite, we give developers the opportunity to write code for good. Our platform
						allows non-profits to create projects and find the perfect developers for them. Not only
						will every line of code written go towards a worthy cause, but we have a gamified system
						that awards our developers with amazing products and opportunities.{" "}
					</p>
					<Link className="join-btn" to="/signup">
						Join Our Community
					</Link>
				</div>
				<img className="abstract" src={abstract} alt="abstract"></img>
			</div>

			<div name="explore" className="explore" id="homepage-explore-section">
				{/* Feature components */}
				<div className="features" id="homepage-features">
					{images.map((image, index) => (
						<div className="feature" key={`feature${index}`}>
							<div className="icon">
								<img src={image.img} alt={image.alt} />
							</div>
							<p>{image.description}</p>
						</div>
					))}
				</div>

				<h2 className="project-title">Awesome Projects Built on Relite</h2>

				{/* DevProjectModal components */}
				<div className="projects" id="homepage-featured-projects">
					{projectData.map((project, index) => (
						<div className="project" key={`project${index}`}>
							<h3>{project.title}</h3>
							<h4>{project.orgName}</h4>
							<h5>Team</h5>
							<p>{project.team}</p>
							<h5>Description</h5>
							<p>{project.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Header;
