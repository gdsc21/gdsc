import React from "react";
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
import projectData from "./projectData";

// Upload css
import "../styles/homepage.css";

const Header = () => {
	let images = [
		{
			img: gitLogo,
			description: "embedded github collaboration",
		},
		{
			img: projectLogo,
			description: "integrated project management",
		},
		{
			img: pointLogo,
			description: "point granting && redemption",
		},
		{
			img: msgLogo,
			description: "individual && group messaging",
		},
	];
	return (
		<div className="header">
			<nav className="nav">
				<div className="logo">
					<img src={logo}></img>
				</div>
				<div className="navlinks noselect">
					<ScrollTo to="home" smooth={true}>
						home
					</ScrollTo>
					<ScrollTo to="explore" smooth={true}>
						explore
					</ScrollTo>
					<ScrollTo to="sponsors" smooth={true}>
						sponsors
					</ScrollTo>
					<ScrollTo to="contact" smooth={true}>
						contact
					</ScrollTo>
					<Link className="btn" to="/signin">
						sign in
					</Link>
					<Link className="signup-btn btn" to="/signup">
						sign up
					</Link>
				</div>
			</nav>
			<div name="home" className="info">
				<div className="text">
					<h1>WELCOME TO SOMETHING GREAT.</h1>
					<h2>A chance for non-profits to expand digitally, a chance for developers to do good.</h2>
					<p>
						At Something Something, we give developers the opportunity to write code for good. Our
						platform allows non-profits to create projects and find the perfect developers for them.
						Not only will every line of code written go towards a worthy cause, but we have a
						gamified system that awards our developers with amazing products and opportunities.{" "}
					</p>
					<Link className="join-btn" to="/signup">
						Join Our Community
					</Link>
				</div>
				<img src={abstract}></img>
			</div>

			<div name="explore" className="explore">
				{/* Feature components */}
				<div className="features">
					{images.map((image, index) => (
						<div className="feature">
							<div className="icon">
								<img src={image.img} />
							</div>
							<p>{image.description}</p>
						</div>
					))}
				</div>

				<h2 className="project-title">Awesome Projects Built on Smth Smth </h2>

				{/* Project components */}
				<div className="projects">
					{projectData.map((project) => (
						<div className="project">
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
