import Highlights from "./highlights";
import img from "../defaultUser.png";
import { fbApp } from "../../../firebase";
import { removeSessionStorage } from "../../../utils";
import { Link } from "react-router-dom";
import Modal from "../../components/modal";
import { useState } from "react";

const Sidebar = ({ user, hamCloseClick }) => {
	const [showEditProfile, setShowEditProfile] = useState(false);

	function signOut() {
		fbApp
			.auth()
			.signOut()
			.then(() => {
				removeSessionStorage("token");
			});
	}

	return (
		<div className="sidebar" id="developer__sidebar">
			<button className="ham-close" onClick={hamCloseClick}>
				<i className="fas fa-times"></i>
			</button>

			<Modal open={showEditProfile} setOpen={setShowEditProfile} title="Edit Profile">
				<form action=""></form>
			</Modal>

			<div className="profile">
				<img src={user.devProfileImgUrl || img} />
				<div className="user">
					<a onClick={() => setShowEditProfile(true)}>
						<span>edit info</span>
					</a>
					<h2>{user.devDisplayName}</h2>
					<h3>{user.devTitle}</h3>
				</div>
			</div>

			<Highlights game={user.gamification} project={{}} />

			<div className="sign-out">
				<Link to="/" onClick={signOut}>
					Sign Out
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
