const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
const { validateNpSignUp, validateNpLogin } = require('../util/validators');


firebase.initializeApp(config);

exports.npSignUp = (request, response) => {
    // extract data from form post request
    const newNp = {
        npName: String(request.body.npName),
        username: String(request.body.username),
        email: String(request.body.email),
        phoneNumber: String(request.body.phoneNumber),
        country: String(request.body.country),
        password: String(request.body.password),
        confirmPassword: String(request.body.confirmPassword),
        website: String(request.body.website)
    };

    // validate data and return 400 error if data is invalid
    const { valid, errors } = validateNpSignUp(newNp);
    if (!valid) return response.status(400).json(errors);

    let token, userId;
    // check if document with passed username exists - if not create the user in firebase
    fs
        .doc(`/non_profit_accounts/${newNp.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({ username: 'this username is already taken' });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newNp.email,
                        newNp.password
                    );
            }
        })
        // get the id token return from firebase authentication
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        //  create a document with the non profits account information
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                npName: newNp.npName,
                username: newNp.username,
                phoneNumber: newNp.phoneNumber,
                country: newNp.country,
                email: newNp.email,
                website: newNp.website,
                createdAt: new Date().toISOString(),
                userId
            };
            return fs
                .doc(`/non_profit_accounts/${newNp.username}`)
                .set({userCredentials: userCredentials});
        })
        // return the authentication token to the client
        .then(()=>{
            return response.status(201).json({ token });
        })
        // catch any errors
        .catch((err) => {
            // console.error(err);
            // if (err.code === 'auth/email-already-in-use') {
            //     return response.status(400).json({ email: 'Email already in use' });
            // }
            // else if (err.code === "auth/weak-password") {
            //     return response.status(400).json({ email: 'Email already in use' });
            // }else {
            //     return response.status(500).json({ general: err.message });
            // }
            return response.status(400).json({error: err.message})
        });
}

exports.npLogin = (request, response) => {
    const np = {
        email: String(request.body.email),
        password: String(request.body.password)
    }

    const { valid, errors } = validateNpLogin(np);
    if (!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(np.email, np.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((err) => {
            return response.status(403).json({ error: err.message});
        })
}

exports.npLogOut = (request, response) => {
    firebase.auth().signOut().then(() => {
        return response.status(200)
    }).catch((err) => {
        return response.status(500).json({error: err})
    });

}

// returns all the data in a non_profits_account document
exports.getNpAccount = (request, response) => {
    fs
        .collection("non_profit_accounts")
        .doc(request.user.username)
        .get()
        .then((doc) => {
            console.log(request.user.username)
            if (doc.exists) {
                // let data = doc.data()
                // npData.userCredentials = data.userCredentials
                return response.json(doc.data())
            }
            else {
                return response.json({word: "hello word"})

            }
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.updateNpProfile = (request, response) => {

}





// let provider = new firebase.auth.GithubAuthProvider();
// firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then((result) => {
//         /** @type {firebase.auth.OAuthCredential} */
//         let credential = result.credential;
//         // This gives you a GitHub Access Token. You can use it to access the GitHub API.
//         let token = credential.accessToken;
//         // The signed-in user info.
//         let user = result.user;
//
//     }).catch((error) => {
//     // Handle Errors here.
//     let errorCode = error.code;
//     let errorMessage = error.message;
//     // The email of the user's account used.
//     let email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     let credential = error.credential;
// });
