import "../scss/signup.scss";
import keyboard from "../img/dev_keyboard.svg";
import charity from "../img/charity_icon.svg";
import { fbApp, fs, fb } from "../../../firebase";
import { setStorageSessionExpire } from "../../../utils";


const MainPage = ({ setSelection }) => {
	const setDev = () => {
		let provider = new fb.auth.GithubAuthProvider();
		let gHtoken, token
		fbApp
			.auth()
			.setPersistence(fb.auth.Auth.Persistence.SESSION)
			.then(() => {
				return fbApp.auth().signInWithPopup(provider)
			})
			.then((result) => {
				// This gives you a GitHub Access Token. You can use it to access the GitHub API.
				gHtoken = result.credential.accessToken;
				return result.user.getIdToken();
			})
			.then((idToken) => {
				token = idToken
				if (token === "undefined") {
					// TODO: Handle what happens if the token is not returned/there was an error
				}

				setStorageSessionExpire("isDev", true, 3600000)
				setStorageSessionExpire("token", token, 3600000)

				// TODO: Redirect to a form page where developer can input their links (linkedIn/portfolio)
			})
			.catch((error) => {
				// https://firebase.google.com/docs/reference/js/firebase.auth.AuthError
				// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithpopup
				switch (error.code) {
					case "auth/account-exists-with-different-credential":
						// TODO: this error would mean that the users github account uses an email that a non-profit uses
						// TODO: so this should probably give a message saying contact us or something like that for now
						break;
					case "auth/popup-blocked":
						// TODO: if the popup is block tell them to allow it/pause adblock to sign in
						break;
					case "auth/popup-closed-by-user":
						// TODO: if the popup is closed and signin couldn't be completed then redirect to the sign up page
						break;
					default:
						// TODO: Unkown error occured alert + redirect to signup/try again
				}
			});


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
