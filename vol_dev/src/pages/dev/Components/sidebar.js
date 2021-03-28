import Achievements from "./achievements";
import StarredProject from "./starredProject";
import img from "../defaultUser.png";
import { fbApp } from "../../../firebase";
import { removeSessionStorage } from "../../../utils";
import { Link } from "react-router-dom";

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
				<i className="fas fa-times"></i>
			</button>

			<div className="profile">
				<img src={user.devProfileImgUrl || img} />
				<div className="user">
					<a src="/">
						<span>edit info</span>
					</a>
					<h1>{user.devDisplayName}</h1>
					<h3>{user.devTitle}</h3>
				</div>
			</div>

			<Achievements game={user.gamification} />
			<StarredProject project={{}} />

			<div className="sign-out">
				<Link to="/" onClick={signOut}>
					Sign Out
				</Link>
			</div>
		</div>
	);
};
export default Sidebar;
