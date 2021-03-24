import Achievements from "./achievements";
import img from "../defaultUser.png";
import { fbApp } from "../../../firebase";
import { removeSessionStorage } from "../../../utils";
import { Switch, Route, Redirect, Link } from "react-router-dom";

const Sidebar = ({ user, hamCloseClick }) => {
	function signOut() {
		fbApp
			.auth()
			.signOut()
			.then(() => {
				removeSessionStorage("token");
			});
	}

	return (
		<div className="sidebar">
			<button className="ham-close" onClick={hamCloseClick}>
				<i class="fas fa-times"></i>
			</button>
			<div className="profile">
				<img src={user.img || img} />
				<div className="user">
					<a src="/">
						<span>edit info</span>
					</a>
					<h1>{user.name}</h1>
					<h3>{user.title}</h3>
				</div>
			</div>
			<Achievements user={user} />
			<div className="sign-out">
				<Link to="/" onClick={signOut}>
					Sign Out
				</Link>
			</div>
		</div>
	);
};
export default Sidebar;
