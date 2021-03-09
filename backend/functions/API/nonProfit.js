const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
const { validateNpSignUp, validateNpLogin, validateNpCredentials, checkUserExist } = require('../util/validators');


firebase.initializeApp(config);

exports.npSignUp = (request, response, next) => {
    /**
     * Takes data from signup form, creates a user account, creates a document for the user, saves info from the form in
     * the document, authenticates the user, returns a JWT token.
     * @param {request} body={npEmail:, npPhoneNumber: optional, npPassword:, npConfirmPassword:, npDisplayName:,
     *                          npCountry:, npWebsite: optional}
     * @return success: status=201 --- json={token:}
     *          failure: status=400/409/500 --- json={message/error: ""/err.message}
     */
        // extract data from form post request -- if field is optional and nothing is passed leave it empty
    let newCredentials = request.body

    // validate data and return 400 error if data is invalid
    const { valid, errors } = validateNpSignUp(newCredentials);
    if (!valid) return response.status(400).json(errors);

    // checks if the email is already in use
    if (checkUserExist(newCredentials.npEmail))
        return response.status(400).json({message: "Email is already taken"})

    // creates the user in admin and then creates an document (title == uid) with the same info (except password)
    let npUid
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
            npUid = userRecord.uid
            console.log("userRecord UID:", npUid)
            fs
                .collection("np_accounts")
                .doc(npUid)
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
            // reset request body and send to login function to authenticate
            request.body = {"npEmail": newCredentials.npEmail, "npPassword":newCredentials.npPassword}
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npLogin = (request, response) => {
    /**
     * Email and password login for non profits. Returns a JWT token.
     * @param {request} body={npEmail:, npPassword}
     * @return success: status=200 --- json={token: token}
     *          failure: status=403 --- json={error: err.message}
     */
    let np
    if (typeof request.body != "object")
        np = JSON.parse(request.body)
    else np = request.body

    // validates email and password
    const { valid, errors } = validateNpLogin(np);
    if (!valid) return response.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(np.npEmail, np.npPassword)
        .then((data) => {
            return data.user.getIdToken(true)
        })
        .then((token) => {
            return response.status(200).json({ token });
        })
        .catch((err) => {
            return response.status(403).json({error: err.message});
        })
}

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
                return response.status(404).json({error: "Account doesn't exist"})
            }
        })
        .catch((err) => {

            return response.status(500).json({error: err.message})
        })
}

exports.updateNpAccountCredentials = (request, response) => {
    /**
     * Updates the email, phone number, display name, website, and country
     * @param {request} body={npEmail:, npDisplayName:, npPhoneNumber:, npCountry:, npWebsite} --- user.uid=decodedToken
     * @return success: status=200 --- json={message: "Updated successfully"}
     *          failure: status=400/500 --- json={error: err.message}
     */
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
                    let npInfo = {
                        npDisplayName: data.npDisplayName,
                        npWebsite: data.npWebsite,
                        npEmail: data.npEmail,
                        npUid: request.user.uid
                    }
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
        .then(() => {
            return response.status(200).json({message: "Updated successfully"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.updateNpProjects = (request, response) => {

}

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {})
        .catch((error) => {})
}

exports.updateNpProfileImg = (request, response) => {
    /**
     * Takes an uploaded file, stores in firebase storage, gets the stored image's url, saves the url to np_accounts
     * document and all of the projects that non profit has.
     * @param {request} file=png/jpg
     * @return success: status=200 --- json={message: 'Image uploaded successfully'}
     *          failure: wrong file type: status=400 --- json={error: "Wrong file type submitted"}
     *          failure: status=500 --- json={error: err.message}
     */
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fsMod = require('fs');
    const busboy = new BusBoy({ headers: request.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return response.status(400).json({ error: 'Wrong file type submitted' });
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${request.user.username}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fsMod.createWriteStream(filePath));
    });
    deleteImage(imageFileName).then()
    let imageUrl
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filePath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            // change img url in np_account document
            .then(() => {
                imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
                fs
                    .collection("np_accounts")
                    .doc(request.user.uid)
                    .update({"npProfileImgURL": imageUrl})
                    .catch((err) => {
                        return response.status(500).json({error: err.message})
                    })
            })
            // update img url in admin
            .then(() => {
                admin
                    .auth()
                    .updateUser(request.user.uid,{
                        photoURL: imageUrl
                    })
                    .catch((err) => {
                        return response.status(500).json({error: err.message})
                    })
                return imageUrl
            })
            // update img url in projects
            .then(() => {
                let collection = fs.collection("projects")
                collection
                    .where("npInfo.npUid", "==", request.user.uid)
                    .get()
                    .then((documents) => {
                        documents.forEach((myDoc) => {
                            collection.doc(myDoc.id)
                                .update({"npInfo.npProfileImgURL": imageUrl})
                                .catch((err) => {
                                    return response.status(500).json({error: err.message})
                                })
                        })
                    })
                    .catch((err) => {
                        return response.status(500).json({error: err.message})
                    })
            })
            .then(() => {
                return response.status(200).json({ message: 'Image uploaded successfully' });
            })
            .catch((error) => {
                return response.status(500).json({ error: error.message });
            });
    });
    busboy.end(request.rawBody);
};


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
