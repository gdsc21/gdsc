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
    // let batch = fs.batch()
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
        .catch((err) => {
            return response.status(400).json({error: err.message})
        })

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

exports.devApplyProject = (request, response, next) => {
    /*
    Applies the developer to a project thereby adding the application to the dev_applications document with status null
     */
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("projects")
        .doc(data.projectId)
        .get()
        .then((doc) => {
            if (!doc.exists) return response.status(404).json({message: "Project no longer exists"})

            // add project data to the request
            data.projectData = doc.data()
            request.body = data

            fs
                .collection("dev_applications")
                .doc(user.uid)
                .update({
                    [data.projectId]: {
                        projTitle: data.projectData.projTitle,
                        projDescription: data.projectData.projDescription,
                        projGithub: data.projectData.projGithub,
                        npDisplayName: data.projectData.npInfo.npDisplayName,
                        npUid: data.projectData.npInfo.npUid,
                        appStatus: null
                    }
                })
                .then(() => {
                    return next() //TODO: link next function
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })

        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}


exports.addBadge = (request, response) => {

}