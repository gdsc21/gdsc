import keyboard from "../img/dev_keyboard.svg";
import {fb, fbApp} from "../../../firebase";
import {setStorageSessionExpire} from "../../../utils";

const DevSignInCard = () => {
    const devSignIn = () => {
        let provider = new fb.auth.GithubAuthProvider();
        let token;
        // let gHtoken
        fbApp
            .auth()
            .setPersistence(fb.auth.Auth.Persistence.SESSION)
            .then(() => {
                return fbApp.auth().signInWithPopup(provider);
            })
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                // gHtoken = result.credential.accessToken;  --- this token can be used to make github requests on
                // behalf of the user
                return result.user.getIdToken();
            })
            .then((idToken) => {
                token = idToken;
                if (token === "undefined") {
                    // TODO: Handle what happens if the token is not returned/there was an error
                }

                setStorageSessionExpire("isDev", true, 3600000);
                setStorageSessionExpire("token", token, 3600000);

                // Redirect to dashboard
                window.location.href = "/dashboard";
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

    return (
        <div className="choice__card" onClick={devSignIn}>
            <img src={keyboard} alt="keyboard" />
            <p className="ima">sign in as a</p>
            <h3 className="title">Developer</h3>
        </div>
    )
}

export default DevSignInCard