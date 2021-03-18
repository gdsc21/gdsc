const { admin, fs, firebase, FieldValue } = require('../util/admin');
const { validateNpSignUp, validateNpLogin, validateNpCredentials, checkUserExist } = require('../util/validators');


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
    if (!valid) return response.status(400).json({errors: errors});

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

exports.npGetAccount = (request, response) => {
    let data, user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user

    let retrieveUID
    if ("npUid" in data) retrieveUID = user.uid
    else retrieveUID = data.npUid
    retrieveUID = String(retrieveUID)

    fs
        .collection("np_accounts")
        .doc(retrieveUID)
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

exports.npUpdateAccount = (request, response, next) => {
    /**
     * Updates the email, phone number, display name, website, and country
     * @param {request} body={npEmail:, npDisplayName:, npPhoneNumber:, npCountry:, npWebsite} --- user.uid=decodedToken
     * @return success: status=200 --- json={message: "Updated successfully"}
     *          failure: status=400/500 --- json={error: err.message}
     */
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    // validate data and return 400 error if data is invalid
    const { valid, errors } = validateNpCredentials(data);
    if (!valid) return response.status(400).json(errors);

    // newUserData populated with email and display name if available
    let newUserData = {}
    "npEmail" in data ? newUserData.email = data.npEmail : ""
    "npDisplayName" in data ? newUserData.displayName = data.npDisplayName : ""
    "npPhoneNumber" in data ? newUserData.phoneNumber = data.npPhoneNumber : ""

    // updates the admin database if email or display name is in newUserData
    if (Object.keys(newUserData).length !== 0) {
        admin
            .auth()
            .updateUser(request.user.uid, newUserData)
            .catch((err) => {
                return response.status(500).json({error: err.message})
            })
    }

    // updates the non profits account document
    let batch = fs.batch()
    let npDocRef = fs.collection("np_accounts").doc(request.user.uid)

    "npEmail" in data ? batch.update(npDocRef, {"npEmail": data.npEmail}) : ""
    "npDisplayName" in data ? batch.update(npDocRef, {"npDisplayName": data.npDisplayName}) : ""
    "npPhoneNumber" in data ? batch.update(npDocRef, {"npPhoneNumber": data.npPhoneNumber}) : ""
    "npWebsite" in data ? batch.update(npDocRef, {"npWebsite": data.npWebsite}) : ""
    "npCountry" in data ? batch.update(npDocRef, {"npCountry": data.npCountry}) : ""

    batch
        .commit()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({message: err.message})
        })
}


deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {})
        .catch((error) => {})
}

exports.npUpdateProfileImg = (request, response) => {
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
            return response.status(400).json({ error: 'Wrong file type' });
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

exports.npAddProject = (request, response) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("np_accounts")
        .doc(user.uid)
        .update({
            [`npProjects.${data.projectId}`]: {
                title: data.title,
                description: data.description,
            }})
        .then(() => {
            return response.status(201).json({projectId: data.projectId})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npDeleteProject = (request, response, next) => {
    /**
     * @param {request} body={projectId}
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let npDocRef = fs.collection("np_accounts").doc(user.uid)

    npDocRef
        .get()
        .then((npDoc) => {
            if (!npDoc.exists) return response.status(400).json({message: "Non-profit doesn't exist"})
            let projects = npDoc.data().npProjects
            if (!(data.projectId in projects)) return response.status(500).json({message: "Unauthorized or project doesn't exist"})

            npDocRef
                .update({
                    [`npProjects.${data.projectId}`]: FieldValue.delete()
                })
                .then(() => {
                    return next()
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })

        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })


}