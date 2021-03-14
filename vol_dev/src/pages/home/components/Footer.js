import React from "react";
import { Link } from "react-scroll";
import "../styles/homepage.css";
import logo from "../img/logo-white.svg";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="top">
				<img className="logo" src={logo}></img>
				<div className="links">
					<Link to="home" smooth={true}>
						home
					</Link>
					<Link to="explore" smooth={true}>
						explore
					</Link>
					<Link to="sponsors" smooth={true}>
						sponsors
					</Link>
					<Link to="contact" smooth={true}>
						contact
					</Link>
				</div>
				<div className="contact-info">
					<p className="email">hello@something.com</p>
					<p className="address">
						12345 Sesame St. <br />
						Edmonton, AB A1B 2C3 <br />
						Canada
					</p>
				</div>
			</div>
			<p className="copyright">Copyright © 2018 Something Something. All Rights Reserved.</p>
		</footer>
	);
};

export default Footer;
