import { Link } from "react-router-dom";

const Achievements = ({ game }) => {
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

				<h5>{level(game.devXP)}</h5>

				<div className="user-progress">
					<progress value={(game.devXP % 2000) / 20} max={100} />
					<h5>{game.devXP} PTS</h5>
				</div>

				<p>
					{2000 - (game.devXP % 2000)} pts until the next level: {level(game.devXP + 2000)}
				</p>
			</div>

			{/* <div className="badges">
				<h3>Badges</h3>
				*insert logo* *insert logo*
			</div> */}

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
