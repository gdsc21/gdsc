import logo from "../../../img/logo.svg";
import "../scss/signup.css";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className="signup_header">
			<nav className="nav">
				<img src={logo} alt="website logo"></img>
				<div className="links">
					<Link className="btn" to="/">
						home
					</Link>
					<Link className="signin-btn btn" to="/signin">
						sign in
					</Link>
				</div>
			</nav>

			<h2 className="heading">Join our ever-growing community!</h2>
		</div>
	);
};

export default Header;
