import { useState } from "react";
import axios from 'axios';
import { fbApp, fs, fb } from "../../firebase"
import { setStorageSessionExpire } from "../../utils";

const SignIn = () => {
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const orgLogin = (e) => {
        e.preventDefault()

        let token
        fbApp
            .auth()
            .setPersistence(fb.auth.Auth.Persistence.SESSION)
            .signInWithEmailAndPassword(Email, Password)
            .then((userCredential) => {
                return userCredential.user.getIdToken(true)
            })
            .then((newToken) => {
                token = newToken
            })
            .catch((err) => {
                // TODO: Sign in error
            })
    }

    const devLogin = () => {
        let provider = new fb.auth.GithubAuthProvider();
        let gHtoken, token
        fbApp
            .auth()
            .setPersistence(fb.auth.Auth.Persistence.SESSION)
            .signInWithPopup(provider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                gHtoken = result.credential.accessToken;

                console.log(result.user)
                return result.user.getIdToken();
            })
            .then((idToken) => {
                token = idToken
                if (token === "undefined") {
                    // TODO: Handle what happens if the token is not returned/there was an error
                }

                setStorageSessionExpire("isDev", true, 3540)
                setStorageSessionExpire("token", token, 3540)

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
    }


    return (
        <div className="orglogin">
            <form onSubmit={ orgLogin }>
                <div className="form-field">
                    <label htmlFor="orgemail">Enter your email</label>
                    <input type="text" id="orgname" value={Email} onChange={e => setEmail(e.target.value)}/>
                    <br />
                </div>
                <div className="form-field">
                    <label htmlFor="orgpass">Enter password</label>
                    <input type="text" id="orgpass" value={Password} onChange={e => setPassword(e.target.value)}/>
                    <br />
                </div>
                <button className="loginButton">Log In</button>
            </form>
        </div>

    );
};

export default SignIn;
