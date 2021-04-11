const { admin, fs, firebase, FieldValue} = require('../util/admin');

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
                if (err.code === "auth/user-not-found") return response.status(404).json({message: "Profile not found"})
                else return response.status(500).json({error: err.message})
            })
    }

    // // creates a batch and reference to the developer profile document
    let devDocRef = fs.collection("dev_accounts").doc(user.uid)

    devDocRef
        .update({
            "devDisplayName": data.devDisplayName,
            "devLinks.devGithub": data.devLinks.devGithub,
            "devLinks.devLinkedIn": data.devLinks.devLinkedIn,
            "devLinks.devWebsite": data.devLinks.devWebsite,
            "devTitle": data.devTitle,
            "devBio": data.devBio
        })
        .then(() => {
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
        })
        .catch((err) => {
            return response.status(400).json({error: err.message})
        })
}

exports.devAddProject = (request, response, next) => {
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
            return next()
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

exports.devUpdateProject = (request, response, next) => {
    // updates the project info on all the developer profiles associated with the project being updated
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    if (!data.devProfiles) return next()

    let batch = fs.batch()
    Object.keys(data.devProfiles).forEach(([devUid]) => {
        let devDocRef = fs.collection("dev_accounts").doc(devUid)
        batch
            .update(devDocRef, {
                [`devProjects.${data.projectId}.projTitle`]: data.projTitle,
                [`devProjects.${data.projectId}.projDescription`]: data.projDescription,
                [`devProjects.${data.projectId}.projGithub`]: data.projGithub
            })
    })

    batch
        .commit()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.devUpdateNpInfo = (request, response) => {
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    if (!data.npDisplayName) return response.status(200).json({message: "Profile updated"})

    let batch = fs.batch()
    fs
        .collection("dev_accounts")
        .doc()
}