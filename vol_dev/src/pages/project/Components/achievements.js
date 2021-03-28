import { Link } from "react-router-dom";

const Achievements = ({ user }) => {
	return (
		<div className="achievements">
			<link
				rel="stylesheet"
				href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
				integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
				crossorigin="anonymous"
			/>

			<div className="xp">
				<h3>Current Xp level</h3>

				<h5>{level(user.points)}</h5>

				<div className="user-progress">
					<progress value={(user.points % 2000) / 20} max={100} />
					<h5>{user.points} PTS</h5>
				</div>

				<p>
					{2000 - (user.points % 2000)} pts until the next level: {level(user.points + 2000)}
				</p>
			</div>

			{/* <div className="badges">
				<h3>Badges</h3>
				*insert logo* *insert logo*
			</div> */}

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
							{/* // TODO: add links to these icons */}

							<Link to="/" name="project page">
								<i class="fa fa-info"></i>
							</Link>

							<Link to="/" name="github page">
								<i class="fab fa-github"></i>
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
	);
};

function level(xp) {
	if (xp >= 6000) {
		return "Grandmaster";
	} else if (xp >= 4000) {
		return "Champion";
	} else if (xp >= 2000) {
		return "Veteran";
	} else {
		return "Newbie";
	}
}

export default Achievements;
