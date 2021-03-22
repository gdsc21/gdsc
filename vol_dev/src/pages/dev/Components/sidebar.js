import Achievements from "./achievements";
import img from "../defaultUser.png";
import { Link } from "react-router-dom";

const Sidebar = ({ user, hamCloseClick }) => {
	return (
		<div className="sidebar">
			<button className="ham-close" onClick={hamCloseClick}>
				<i class="fas fa-times"></i>
			</button>

			<div className="profile">
				<img src={img} />
				<div className="user">
					<a src="/">
						<span>edit info</span>
					</a>
					<h2>{user.name}</h2>
					<h3>{user.title}</h3>
				</div>
			</div>

			<Achievements user={user} />

			<div className="sign-out">
				<a href="/">sign out</a>
			</div>
		</div>
	);
};
export default Sidebar;
