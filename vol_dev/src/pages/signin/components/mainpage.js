import "../styles/signin.css";
import keyboard from "../img/dev_keyboard.svg";
import charity from "../img/charity_icon.svg";

const MainPage = ({ setSelection }) => {
	const setDev = () => {
		// TODO: Do dev signin backend
	};

	const setNonprofit = () => {
		setSelection("org");
	};

	return (
		<div className="main_signin">
			<h3 className="heading">Select your role to log back in</h3>
			<div className="cards">
				<div className="choice__card" onClick={setDev}>
					<img src={keyboard} alt="keyboard" />
					<p className="ima">sign in as a</p>
					<h3 className="title">Developer</h3>
				</div>
				<div className="choice__card" onClick={setNonprofit}>
					<img className="nonprof_img" src={charity} alt="keyboard" />
					<p className="ima">sign in as a</p>
					<h3 className="title">Non-profit</h3>
				</div>
			</div>
		</div>
	);
};

export default MainPage;
