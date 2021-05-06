const { admin, fs, firebase, FieldValue } = require('../util/admin');


exports.devAppApply = (request, response, next) => {
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
            if (!doc.exists) return response.status(404).json({message: "DevProjectModal doesn't exist"})

            // add project data and current timestamp to the request body
            data.projectData = doc.data()
            data.creationDate = Date.now()
            request.body = data

            console.log(user.uid, typeof user.uid)
            fs
                .collection("dev_applications")
                .doc(user.uid)
                .set({
                    [data.projectId]: {
                        projTitle: data.projectData.projTitle,
                        projDescription: data.projectData.projDescription,
                        projGithub: data.projectData.projGithub,
                        npDisplayName: data.projectData.npInfo.npDisplayName,
                        npUid: data.projectData.npInfo.npUid,
                        creationData: data.creationDate,
                        appStatus: null
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
}

exports.devAppAccepted = (request, response) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("dev_applications")
        .doc(data.devUid)
        .update({
            [`${data.projectId}.appStatus`]: "accepted"
        })
        .then(() => {
            return response.status(200).json({message: "Developer Accepted"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.devAppRejected = (request, response, next) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("dev_applications")
        .doc(user.uid)
        .update({
            [data.projectId.appStatus]: "rejected"
        })
        .then(() => {
            next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.devAppGetApplications = (request, response) => {
    let user
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user

    fs
        .collection("dev_applications")
        .doc(user.uid)
        .get()
        .then((docRef) => {
            if (!docRef.exists) return response.status(400).json({message: "Account doesn't exist"})
            let docData = docRef.data()
            return response.status(200).json(docData)
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}
