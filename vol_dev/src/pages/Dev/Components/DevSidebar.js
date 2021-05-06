import img from "../img/defaultUser.png";
import { signOut } from "../../../utils";
import { Link } from "react-router-dom";

const DevSidebar = ({ user, hamCloseClick, setShowEditProfile }) => {
	return (
		<div className="sidebar" id="developer__sidebar">
			<button className="ham-close" onClick={hamCloseClick}>
				<i className="fas fa-times"></i>
			</button>

			<div className="profile">
				<img src={user.devProfileImgUrl || img} alt="profile picture" />
				<div className="user">
					<div onClick={() => setShowEditProfile(true)}>
						<span>edit info</span>
					</div>
					<h2>{user.devDisplayName}</h2>
					<h3>{user.devTitle}</h3>
				</div>
			</div>

			<div className="achievements">
				<div className="description">
					<h3>Bio</h3>

					{user.devBio || user.devLinks.devWebsite || user.devLinks.devLinkedIn ? (
						<p>{user.devBio}</p>
					) : (
						<div className="no-starred">
							<h5>You currently have no biography</h5>
							<p>To add one, click on "Edit Profile" to set your information</p>
						</div>
					)}

					<div className="links">
						{user.devLinks.devWebsite && (
							<a href={user.devLinks.devWebsite} name="project page">
								<i className="fa fa-info"></i>
							</a>
						)}

						{user.devLinks.devLinkedIn && (
							<a href={user.devLinks.devLinkedIn} name="github page">
								<i className="fab fa-github"></i>
							</a>
						)}
					</div>
				</div>

				<div className="xp">
					<h3>Current XP level</h3>

					<h5>{level(user.gamification.devXP)}</h5>

					<div className="user-progress">
						<progress value={(user.gamification.devXP % 2000) / 20} max={100} />
						<h5>{user.gamification.devXP} PTS</h5>
					</div>

					<p>
						{2000 - (user.gamification.devXP % 2000)} pts until the next level:{" "}
						{level(user.gamification.devXP + 2000)}
					</p>
				</div>

				{
					// TODO: Add badge system
					/* <div className="badges">
				<h3>Badges</h3>
					*insert logo* *insert logo*
				</div> */
				}

				<div className="starproject">
					<h3>Starred Project</h3>
					{user.starProject ? (
						// If the current user has a starred project, display it
						<div className="proj">
							<div className="proj-details">
								<h4>{user.starProject.title}</h4>
								<h5>{user.starProject.org}</h5>
							</div>

							<div className="proj-icon">
								{/* 
									// TODO: add links to these icons 
								*/}

								<Link to="/" name="project page">
									<i className="fa fa-info"></i>
								</Link>

								<Link to="/" name="github page">
									<i className="fab fa-github"></i>
								</Link>
							</div>
						</div>
					) : (
						//otherwise, add a link to add your starred project
						<div className="no-starred">
							<h5>You currently have no starred project</h5>
							<p>To add a starred project, select "star" on your desired project's page</p>
						</div>
					)}
				</div>
			</div>

			<div className="sign-out">
				<Link to="/" onClick={signOut}>
					Sign Out
				</Link>
			</div>
		</div>
	);
};

function level(xp) {
	if (xp >= 6000) {
		return "Grandmaster";
	} else if (xp >= 4000) {
		return "Expert";
	} else if (xp >= 2000) {
		return "Master";
	} else {
		return "Newbie";
	}
}

export default DevSidebar;
