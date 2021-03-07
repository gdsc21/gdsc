const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
const { validateNpSignUp, validateNpLogin, validateNpCredentials } = require('../util/validators');


firebase.initializeApp(config);

exports.npSignUp = (request, response) => {
    // extract data from form post request -- if field is optional and nothing is passed leave it empty
    let newCredentials = request.body

    // validate data and return 400 error if data is invalid
    const { valid, errors } = validateNpSignUp(newCredentials);
    if (!valid) return response.status(400).json(errors);

    // check if a user with the entered email already exists if so return error otherwise move on
    admin
        .auth()
        .getUserByEmail(newCredentials.npEmail)
        .then((userRecord) => {
            return response.status(409).json({
                npEmail: "This email is already taken. If this is your email please login instead."})
        })
        .catch((err) => {
            if (err.code === "auth/user-not-found") {} // ignore the error thrown if the user (email) doesn't exist
            else return response.status(500).json({error: err.message})
        })

    // creates the user in admin and then creates an document (title == uid) with the same info (except password)
    // then it logs the user in and returns an authorization token
    admin
        .auth()
        .createUser({
            email: newCredentials.npEmail,
            phoneNumber: newCredentials.npPhoneNumber,
            password: newCredentials.npPassword,
            displayName: newCredentials.npDisplayName
        })
        // creates the document associated with the user in np_accounts collection
        .then((userRecord) => {
            fs
                .collection("np_accounts")
                .doc(userRecord.uid)
                .set({
                    npEmail: newCredentials.npEmail,
                    npPhoneNumber: newCredentials.npPhoneNumber,
                    npDisplayName: newCredentials.npDisplayName,
                    npWebsite: newCredentials.npWebsite,
                    npCountry: newCredentials.npCountry
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        })
        // signs the user in and returns a JWT token
        .then(() => {
            firebase
                .auth()
                .signInWithEmailAndPassword(newCredentials.npEmail, newCredentials.npPassword)
                .then((userCredential) => {
                    return userCredential.user.getIdToken()
                })
                // KEEP THESE 2 .then STATEMENTS SEPARATED TO AVOID CIRCULAR JSON ERROR --- OTHERWISE TOKEN WILL BE
                // INVALID AS IT IS ASSIGNED AN INTERMEDIATE VALUE THAT HASN'T FULLY LOADED
                .then((idToken) => {
                    return response.status(201).json({ token: idToken })
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npLogin = (request, response) => {
    const np = {
        npEmail: request.body.npEmail,
        npPassword: request.body.npPassword
    }
    // validates email and password
    const { valid, errors } = validateNpLogin(np);
    if (!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(np.npEmail, np.npPassword)
        .then((data) => {
            return data.user.getIdToken()
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((err) => {
            return response.status(403).json({ error: err.message});
        })
}

// returns all the data in a non_profits_account document
exports.getNpAccount = (request, response) => {
    fs
        .collection("np_accounts")
        .doc(request.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.json(doc.data())
            }
            else {
                return response.json({error: "Account doesn't exist"})
            }
        })
        .catch((err) => {

            return response.status(500).json({error: err.message})
        })
}

// update non profit account credentials -- updates the info in all places including project pages
exports.updateNpAccountCredentials = (request, response) => {
    let data = JSON.parse(request.body)

    // validate data and return 400 error if data is invalid
    const { valid, errors } = validateNpCredentials(data);
    if (!valid) return response.status(400).json(errors);

    // updates the admin db
    admin
        .auth()
        .updateUser(request.user.uid,{
            email: data.npEmail,
            phoneNumber: data.npPhoneNumber,
            displayName: data.npDisplayName
        })
        .then((userRecord) => {
            return response.status(200).json({message: "Updated successfully"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
    // updates the np account document
    fs
        .collection("np_accounts")
        .doc(request.user.uid)
        .update(data)
        // update all the non profit credentials in all of its projects
        .then(() => {
            let collection = fs.collection("projects")
            collection
                .where("npInfo.npUid", "==", request.user.uid)
                .get()
                .then((documents) => {
                    console.log(documents.docs)
                    let npInfo = {
                        npName: data.npName,
                        npWebsite: data.npWebsite,
                        npEmail: data.npEmail,
                        npUid: request.user.uid
                    }
                    // for (let i in documents.docs) {
                    //     const doc = documents.docs[i]
                    //     doc.update({npInfo: npInfo})
                    // }
                    documents.forEach((myDoc) => {
                        collection.doc(myDoc.id)
                            .update({npInfo: npInfo})
                            .catch((err) => {
                                return response.status(500).json({error: err.message})
                            })
                    })
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}


exports.updateNpProjects = (request, response) => {

}

exports.updateNpProfilePic = (request, response) => {

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
//     // The npEmail of the user's account used.
//     let npEmail = error.npEmail;
//     // The firebase.auth.AuthCredential type that was used.
//     let credential = error.credential;
// });
