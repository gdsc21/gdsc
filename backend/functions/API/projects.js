const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');


if (!firebase.apps.length) {
    firebase.initializeApp(config);
}else {
    firebase.app(); // if already initialized, use that one
}

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

            fs
                .collection("projects")
                .add({
                    title: data.title,
                    description: data.description,
                    npInfo: npInfo,
                    devProfiles: {},
                    GitHubRepo: ""
                })
                .then((projectDoc) => {
                    // must reassign request.body since request.body.projectId does not work to create a new key in body
                    data.projectId = projectDoc.id
                    request.body = data
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

exports.projDelete = (request, response) => {
    /**
     * Deletes a created project and returns a 500 error if the project doesn't exist
     * @param {request} body={projectId:} --- user=decodedToken
     * @param {response}
     * @return success: status=200 --- json={message: Successfully deleted the project}
     *          failure: status=500 --- json={error: err.message}
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    // delete project from non profit account document
    // let projects
    // let npDocRef = fs.collection("np_accounts").doc(user.uid)
    // npDocRef
    //     .get()
    //     .then((npDoc) => {
    //         projects = npDoc.data().npProjects
    //         if (!(projectId in projects)) {
    //             return response.status(400).json({message: "Cannot delete this project"})
    //         } else {
    //             delete projects[projectId]
    //             npDocRef
    //                 .update({"npProjects": projects})
    //                 .then(() => {
    //                     return response.status(200).json({message: "Successfully deleted the project!"})
    //                 })
    //                 .catch((err) => {
    //                     return response.status(500).json({error: err.message})
    //                 })
    //         }
    //     })
    //     .catch((err) => {
    //         return response.status(500).json({error: err.message})
    //     })

    // delete project document
    fs
        .collection("projects")
        .doc(data.projectId)
        .delete()
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
    const data = JSON.parse(request.body)
    fs
        .collection("projects")
        .doc(data.projectId)
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

exports.projUpdateNpInfo = (request, response) => {
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
                "npEmail" in data ? batch.update(doc.ref, {"npInfo.npEmail": data.npEmail}) : ""
                "npDisplayName" in data ? batch.update(doc.ref, {"npInfo.npDisplayName": data.npDisplayName}) : ""
                "npPhoneNumber" in data ? batch.update(doc.ref, {"npInfo.npPhoneNumber": data.npPhoneNumber}) : ""
                "npWebsite" in data ? batch.update(doc.ref, {"npInfo.npWebsite": data.npWebsite}) : ""
                "npCountry" in data ? batch.update(doc.ref, {"npInfo.npCountry": data.npCountry}) : ""
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

    // updates all the project documents that contains a developers profile
    let batch = fs.batch()

    let projCollection = fs.collection("projects")
    devProjects.forEach((projectId) => {
        let docRef = projCollection.doc(projectId)

        // creates updates for each data point that is passed in the request body -- if not include no update is created
        "devDisplayName" in data ? batch.update(docRef, {[`devProfiles.${user.uid}.devDisplayName`]: data.devDisplayName}) : ""
        if ("devLinks" in data) {
            "devGitHub" in data.devLinks ? batch.update(docRef, {[`devProfiles.${user.uid}.devLinks.devGitHub`]: data.devLinks.devGitHub}) : ""
            "devWebsite" in data.devLinks ? batch.update(docRef, {[`devProfiles.${user.uid}.devLinks.devWebsite`]: data.devLinks.devWebsite}) : ""
            "devLinkedIn" in data.devLinks ? batch.update(docRef, {[`devProfiles.${user.uid}.devLinks.devLinkedIn`]: data.devLinks.devLinkedIn}) : ""
        }
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
                    title: projData.title,
                    description: projData.description,
                    gitHubRepo: projData.gitHubRepo,
                    npDisplayName: projData.npInfo.npDisplayName,
                    npUid: user.uid
                }
                request.body.projectInfo = projInfo
            }
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })

    // retrieves the developer profile using their uid
    let devProfile
    fs
        .collection("dev_accounts")
        .doc(data.devUid)
        .get()
        .then((devDoc) => {
            if (devDoc.exists) devProfile = devDoc.data()
            else return response.status(400).json({message: "Developer profile doesn't exist"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })


    // adds the developer profile to the project document and passes on to the next function
    projDocRef
        .update({
            "devProfiles": {
                [user.uid]: {
                    "devDisplayName": devProfile.devDisplayName,
                    "devLinks": {
                        "devWebsite": devProfile.devLinks.devWebsite,
                        "devGitHub": devProfile.devLinks.devGitHub,
                        "devLinkedIn": devProfile.devLinks.devLinkedIn
                    }
                }
            }
        })
        .then(() => {
            return next()
        })
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
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })

    // deletes the developer profile from the project page
    projDocRef
        .update({
            [`devProfiles.${data.devUid}`]: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })



}

exports.addCommit = (request, response) => {

}


