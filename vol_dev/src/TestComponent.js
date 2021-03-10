import React from 'react'
import { fs } from "./firebase"

const TestComponent =() => {
    return (
        <button onClick={handleClick}>NOOOOB</button>
    )
}


const handleClick =() => {
    let provider = new fs.auth.GithubAuthProvider();
    let gHtoken
    fs
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            gHtoken = result.credential.accessToken;
            return result.user.getIdToken()
        })
        .then((idToken) => {
            console.log(idToken)

        })
        .catch((error) => {
            console.log(error.code)
        });


}

export default TestComponent;