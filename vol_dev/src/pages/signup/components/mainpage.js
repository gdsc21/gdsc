import "../scss/signup.scss";
import keyboard from "../img/dev_keyboard.svg";
import charity from "../img/charity_icon.svg";

const MainPage = ({ setSelection }) => {
	const setDev = () => {
		console.log("waddup im a developer");
	};

	const setNonprofit = () => {
		setSelection("org");
	};

	return (
		<div className="main_signup">
			<h3 className="heading">Which of these describes you best?</h3>
			<div className="cards">
				<div className="choice__card" onClick={setDev}>
					<img src={keyboard} alt="keyboard" />
					<p className="ima">I'm a</p>
					<h3 className="title">Developer</h3>
					<div className="description">
						<p>I would like to donate some of my time to help non-profits.</p>
						<p className="subdescription">(and get some awesome rewards!)</p>
					</div>
				</div>
				<div className="choice__card" onClick={setNonprofit}>
					<img className="nonprof_img" src={charity} alt="keyboard" />
					<p className="ima">I'm a</p>
					<h3 className="title">Non-profit</h3>
					<p className="description">
						I would like to find some amazing developers to work on my software project(s).
					</p>
				</div>
			</div>
		</div>
	);
};

export default MainPage;
