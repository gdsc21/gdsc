import logo from "../../../img/logo.svg";
import "../styles/signin.css";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className="signin_header">
			<nav className="nav">
				<img src={logo} alt="website logo"/>
				<div className="links">
					<Link className="btn" to="/">
						home
					</Link>
					<Link className="signup-btn btn" to="/signup">
						sign up
					</Link>
				</div>
			</nav>

			<h2 className="heading">Welcome back!</h2>
		</div>
	);
};

export default Header;
