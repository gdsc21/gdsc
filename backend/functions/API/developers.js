const { admin, fs, firebase, FieldValue} = require('../util/admin');
const functions = require('firebase-functions');


// exports.devCreateProfile = (request, response) => {
//     /**
//      * Takes a token retrieved through Github auth - verifies it and then uses the returned user object to create an
//      * associated developer document containing all the data passed in the body
//      */
//     let user, data
//     if (typeof request.user != "object")
//         user = JSON.parse(request.user)
//     else user = request.user
//     if (typeof request.body != "object")
//         data = JSON.parse(request.body)
//     else data = request.body
//
//     fs
//         .collection("dev_accounts")
//         .doc(user.uid)
//         .set({
//             devDisplayName: user.displayName, // display name is username while name is the developers actual name
//             devProfileImgUrl: user.photoURL,
//             devLinks: {
//                 devWebsite: "",
//                 devGitHub: "",
//                 devLinkedIn: "",
//             },
//             gamification: {
//                 devLevel: 0,
//                 devXP: 0,
//                 devRole: "developer",
//                 devBadges: {}
//             },
//             devProjects: {},
//             devCommits: {}
//         })
//         .then(() => {
//             return response.status(201).json({message: "Account successfully created!"})
//         })
//         .catch((err) => {
//             return response.status(500).json({error: err.message})
//         })
// }

exports.devGetProfile = (request, response) => {
    let user, params
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.params != "object")
        params = JSON.parse(request.params)
    else params = request.params

    let uid
    if ("devUid" in Object.keys(params)) uid = params.devUid
    else uid = user.uid

    fs
        .collection("dev_accounts")
        .doc(uid)
        .get()
        .then((devDoc) => {
            if (devDoc.exists) return response.status(200).json(devDoc.data())
            else return response.status(400).json({message: "Profile doesn't exists!"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.devUpdateProfile = (request, response, next) => {
    /**
     * Updates a developer profile (name, username, email, GitHub, website, LinkedIn).
     * NOT TO BE USED FOR GAMIFICATION/COMMITS/PROJECTS IF FIELD IS NOT BEING UPDATED DO NOT SEND IT AS NULL.
     * DON'T INCLUDE IT IN THE DICTIONARY/OBJECT
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    // newUserData populated with email and display name if available
    let newUserData = {}
    "devDisplayName" in data ? newUserData.displayName = data.devDisplayName : ""

    // updates the admin database if email or display name is in newUserData
    if (Object.keys(newUserData).length !== 0) {
        admin
            .auth()
            .updateUser(user.uid, newUserData)
            .catch((err) => {
                if (err.code === "") return response.status(404).json({message: "Profile not found"})
                else return response.status(500).json({error: err.message})
            })
    }

    // // creates a batch and reference to the developer profile document
    // let batch = fs.batch()
    let devDocRef = fs.collection("dev_accounts").doc(user.uid)
    //
    // // creates updates for each data point that is passed in the request body -- if not include no update is created
    // "devDisplayName" in data ? batch.update(devDocRef, {"devDisplayName": data.devDisplayName}) : ""
    // if ("devLinks" in data) {
    //     "devGitHub" in data.devLinks ? batch.update(devDocRef, {"devLinks.devGitHub": data.devLinks.devGitHub}) : ""
    //     "devWebsite" in data.devLinks ? batch.update(devDocRef, {"devLinks.devWebsite": data.devLinks.devWebsite}) : ""
    //     "devLinkedIn" in data.devLinks ? batch.update(devDocRef, {"devLinks.devLinkedIn": data.devLinks.devLinkedIn}) : ""
    // }
    // "devTitle" in data ? batch.update(devDocRef, {"devTitle": data.devTitle}) : ""
    // "devBio" in data ? batch.update(devDocRef, {"devBio": data.devBio}) : ""

    devDocRef
        .update({
            "devDisplayName": data.devDisplayName,
            "devLinks.devGitHub": data.devLinks.devGitHub,
            "devLinks.devLinkedIn": data.devLinks.devLinkedIn,
            "devLinks.devWebsite": data.devLinks.devWebsite,
            "devTitle": data.devTitle,
            "devBio": data.devBio
        })
        .catch((err) => {
            return response.status(400).json({error: err.message})
        })

    // commit the updates and return
    // batch
    //     .commit()
    //     .catch((err) => {
    //         return response.status(500).json({error: err.message})
    //     })

    // adds the projects the developer is on to the request body
    devDocRef
        .get()
        .then((devDoc) => {
            let devData = devDoc.data()
            request.body.projects = Object.keys(devData.devProjects)
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.devAddProject = (request, response) => {
    /**
     * Takes the projectInfo passed by the previous function and adds the project info to a developer profile.
     * @param {request} body={projectId:, devUid:, projectInfo: {title:, description:, gitHubRepo:, npDisplayName:, npUid:}}
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("dev_accounts")
        .doc(data.devUid)
        .update({
            [`devProjects.${data.projectId}`]: data.projectInfo
        })
        .then(() => {
            return response.status(201).json({message: "Developer added"})
        })
        .catch((err) => {
            if (err.code === "not-found") return response.status(400).json({message: "Developer doesn't exist"})
            return response.status(500).json({error: err.message})
        })
}

exports.devDeleteProject = (request, response) => {
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("dev_accounts")
        .doc(data.devUid)
        .update({
            [`devProjects.${data.projectId}`]: FieldValue.delete()
        })
        .then(() => {
            return response.status(200).json({message: "Developer removed from project"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}


exports.addBadge = (request, response) => {

}

exports.devApplyProject = (request, response, next) => {
    /*
    Takes {projectId:, projectInfo: {**to be displayed on dev dashboard **}, userProfile: {**userStore** from react context}
    npInfo: {**from project card**}
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body
    console.log(user.uid)

    fs
        .collection("dev_accounts")
        .doc(user.uid)
        .update({
            [`devAppliedProjects.${data.projectId}`]: data.projectInfo
        })
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}
