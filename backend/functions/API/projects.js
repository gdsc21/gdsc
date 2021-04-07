const { fs, FieldValue } = require('../util/admin');


exports.projCreate = (request, response, next) => {
    /**
     * Creates a new project document with a random uid as the file name and inserts a title, description and npInfo
     * @param {request} body={title:, description:}
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let npInfo
    fs
        .collection("np_accounts")
        .doc(user.uid)
        .get()
        .then((npDoc) => {
            // if the document doesn't exist then the request is not from a non-profit and is therefore unauthorized
            if (!npDoc.exists) return response.status(401).json({message: "Unauthorized"})

            let docData = npDoc.data()
            npInfo = {
                npEmail: docData.npEmail,
                npDisplayName: docData.npDisplayName,
                npWebsite: docData.npWebsite,
                npUid: user.uid
            }

            // create project document and add project to the allProjects document
            let projectColRef = fs.collection("projects")
            projectColRef
                .add({
                    projTitle: data.projTitle,
                    projDescription: data.projDescription,
                    npInfo: npInfo,
                    devProfiles: {},
                    projGithub: ""
                })
                .then((projectDoc) => {
                    // must reassign request.body since request.body.projectId does not work to create a new key in body
                    data.projectId = projectDoc.id
                    request.body = data

                    // adds the newly created project info to the all projects document
                    projectColRef
                        .doc("allProjects")
                        .set({
                            [data.projectId]: {
                                projTitle: data.projTitle,
                                projDescription: data.projDescription,
                                projGithub: ""
                            }
                        }, { merge: true })
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
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.projGetAll = (request, response) => {
    fs
        .collection("projects")
        .doc("allProjects")
        .then((doc) => {
            let data = doc.data()
            return response.status(200).json(data)
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.projDelete = (request, response, next) => {
    /**
     * Deletes a created project and returns a 500 error if the project doesn't exist
     * @param {request} body={projectId:} --- user=decodedToken
     * @param {response}
     * @return success: status=200 --- json={message: Successfully deleted the project}
     *          failure: status=500 --- json={error: err.message}
     */
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let projectColRef = fs.collection("projects")

    // deletes the project document
    projectColRef
        .doc(data.projectId)
        .delete()
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })

    // deletes the project info from the all projects document
    projectColRef
        .doc("allProjects")
        .update({
            [data.projectId]: FieldValue.delete()
        })
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })

}

exports.projLoad = (request, response) => {
    /**
     * Takes a projectId and returns the document data for that project
     * @param {request} body={projectId:}
     * @return success: status=200 --- json={document data}
     *          failure: status=404 --- json={message: Project not found} OR
     *          failure: status=500 --- json={error: err.message}
     */
    let params
    if (typeof request.params != "object")
        params = JSON.parse(request.params)
    else params = request.params

    if (!("projectId" in params)) return response.status(400).json({message: "Must provide a project id to retrieve!"})

    fs
        .collection("projects")
        .doc(params.projectId)
        .get()
        .then((projectDoc) => {
            if (projectDoc.exists) {
                return response.status(200).json(projectDoc.data())
            } else {
                return response.status(404).json({message: "Project not found"})
            }
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.projUpdateNpInfo = (request, response, next) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    // updates all the project documents that belong to a specific non profit
    let batch = fs.batch()
    fs
        .collection("projects")
        .where("npInfo.npUid", "==", user.uid)
        .get()
        .then((projectDocs) => {
            projectDocs.forEach((doc) => {
                batch
                    .update(doc.ref, {
                        "npInfo.npEmail": data.npEmail,
                        "npInfo.npDisplayName": data.npDisplayName,
                        "npInfo.npPhoneNumber": data.npPhoneNumber,
                        "npInfo.npWebsite": data.npWebsite,
                        "npInfo.npCountry": data.npCountry
                    })
            })
        })
        .then(() => {
            batch
                .commit()
                .then(() => {
                    return next()
                })
                .catch((err) => {
                    return response.status(500).json({message: err.message})
                })
        })
        .catch((err) => {
            console.log(err.code)
            return response.status(500).json({error: err.message})
        })
}

exports.projUpdate = (request, response, next) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let projectRef = fs.collection("projects").doc(data.projectId)

    projectRef
        .get()
        .then((doc) => {
            let docData = doc.data()

            // adds the project developers to the request body
            data.projDevs = docData.devProfiles
            request.body = data

            if (docData.npInfo.npUid != user.uid) return response.status(404).json({error: "Unauthorized"})
            else {
                // updates the project document
                projectRef
                    .update({
                        projTitle: data.projTitle,
                        projDescription: data.projDescription,
                        projGithub: data.projGithub
                    })
                    .catch((err) => {
                        return response.status(500).json({message: err.message})
                    })
                // updates the allProject document
                fs
                    .collection("projects")
                    .doc("allProjects")
                    .update({
                        [`${data.projectId}.projTitle`]: data.projTitle,
                        [`${data.projectId}.projDescription`]: data.projDescription,
                        [`${data.projectId}.projGithub`]: data.projGithub
                    })
                    .catch((err) => {
                        return response.status(500).json({message: err.message})
                    })
            }
        })
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.projUpdateDevInfo = (request, response) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    // array of projectId's that the developer is on
    let devProjects = data.devProjects
    if (!devProjects) return response.status(200).json({message: "success"})

    // updates all the project documents that contains a developers profile
    let batch = fs.batch()

    let projCollection = fs.collection("projects")
    devProjects.forEach((projectId) => {
        let docRef = projCollection.doc(projectId)
        batch
            .update(docRef, {
                [`devProfiles.${user.uid}.devDisplayName`]: data.devDisplayName,
                [`devProfiles.${user.uid}.devLinks.devGithub`]: data.devLinks.devGithub,
                [`devProfiles.${user.uid}.devLinks.devLinkedIn`]: data.devLinks.devLinkedIn,
                [`devProfiles.${user.uid}.devLinks.devWebsite`]: data.devLinks.devWebsite,
                [`devProfiles.${user.uid}.devTitle`]: data.devTitle,
            })
            .catch((err) => {
                return response.status(400).json({error: err.message})
            })
    })

    batch
        .commit()
        .then(() => {
            return response.status(200).json({message: "Profile updated"})
        })
        .catch((err) => {
            return response.status(500).json({message: err.message})
        })
}

exports.projAddDev = (request, response, next) => {
    /**
     * Takes a developer profile uid and adds that developers profile to a project. Only a non-profit who owns a project
     * has access to this method. There are three major parts: 1) check if the current uid matches that of npUid in the
     * project document 2) get the developers profile 3) update the project page with the developers info 4) updates
     * the request with the updated projects information and sends to function that updates the developer's document
     * @param {request} body={projectId:, devUid:}
     * @return {response} next()
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let projInfo
    let projDocRef = fs.collection("projects").doc(data.projectId)

    // checks if the uid of the user who made the request matches the npUid in the project document and update
    // projInfo to pass into the request (to update the developer profile later)
    projDocRef
        .get()
        .then((projDoc) => {
            if (projDoc.exists) {
                let projData = projDoc.data()
                if (projData.npInfo.npUid !== user.uid) return response.status(401).json({error: "Unauthorized"})

                projInfo = {
                    projTitle: projData.projTitle,
                    projDescription: projData.projDescription,
                    projGithub: projData.projGithub,
                    npDisplayName: projData.npInfo.npDisplayName,
                    npUid: user.uid
                }
                request.body.projectInfo = projInfo
            }
        })
        .then(() => {
            let devProfile
            fs
                .collection("dev_accounts")
                .doc(data.devUid)
                .get()
                .then((devDoc) => {
                    if (devDoc.exists) {
                        devProfile = devDoc.data()
                        // adds the developer profile to the project document and passes on to the next function
                        projDocRef
                            .update({
                                "devProfiles": {
                                    [user.uid]: {
                                        "devDisplayName": devProfile.devDisplayName,
                                        "devTitle": devProfile.devTitle,
                                        "devProfileImgUrl": devProfile.devProfileImgUrl,
                                        "devLinks": {
                                            "devWebsite": devProfile.devLinks.devWebsite,
                                            "devGithub": devProfile.devLinks.devGithub,
                                            "devLinkedIn": devProfile.devLinks.devLinkedIn
                                        }
                                    }
                                }
                            })
                            .then(() => {
                                return next()
                            })
                            .catch((err) => {
                                return response.status(500).json({error: err.message})
                            })
                    }
                    else return response.status(400).json({message: "Developer profile doesn't exist"})
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })

    // retrieves the developer profile using their uid




}

exports.projRemoveDev = (request, response, next) => {
    /**
     * Takes a projectId and devUid and deletes that developer from the project.
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let projDocRef = fs.collection("projects").doc(data.projectId)

    // checks if the uid of the user who made the request matches the npUid in the project document
    projDocRef
        .get()
        .then((projDoc) => {
            if (projDoc.exists) {
                if (projDoc.data().npInfo.npUid !== user.uid)
                    return response.status(401).json({error: "Unauthorized"})
            } else return response.status(400).json({message: "Project doesn't exists"})

        })
        .then(() => {
            // deletes the developer profile from the project page
            projDocRef
                .update({
                    [`devProfiles.${data.devUid}`]: FieldValue.delete()
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

exports.addCommit = (request, response) => {

}

exports.createProjectRepo = (request, response) => {
    // use github app to create project repo with project title as repo name
    // TODO: add repo id to the project created page so that the github function that adds commit history can find it
}

exports.getAllProjects = (request, response) => {
    fs
        .collection("projects")
        .doc("allProjects")
        .get()
        .then((doc) => {
            let docData = doc.data()
            return response.status(200).json(docData)
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

