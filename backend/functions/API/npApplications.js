const { admin, fs, firebase, FieldValue } = require('../util/admin');

exports.npAppAddProject = (request, response) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("np_applications")
        .doc(user.uid)
        .set({
            [data.projectId]: {
                developers: {},
                projectInfo: {
                    projTitle: data.projTitle,
                    projDescription: data.projDescription,
                    projGithub: ""
                }
            }
        }, { merge: true})
        .then(() => {
            return response.status(201).json({projectId: data.projectId})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npAppDeleteProject = (request, response) => {
}

exports.npAcceptDev = (request, response, next) => {
    // request.body = { devUid: , projectId:}
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("np_applications")
        .doc(user.uid)
        .update({
            // delete developer application
            [`${data.projectId}.developers.${data.devUid}`]: FieldValue.delete()
        })
        .then(() => {
            return next() // pass to devAppAccepted
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npRejectDev = (request, response, next) => {
    // request.body = { devUid: , projectId:}
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("np_applications")
        .doc(user.uid)
        .update({
            // delete developer application
            [`${data.projectId}.developers.${data.devUid}`]: FieldValue.delete()
        })
        .then(() => {
            return next() // pass to devAppRejected
        })
}

exports.npAddDevApplied = (request, response) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("dev_accounts")
        .doc(user.uid)
        .get()
        .then((devRef) => {
            if (!devRef.exists) return response.status(400).json({message: "Developer doesn't exist"})
            let devData = devRef.data()

            fs
                .collection("np_applications")
                .doc(data.projectData.npInfo.npUid)
                .update({
                    [`${data.projectId}.developers.${user.uid}`]: {
                        devDisplayName: devData.devDisplayName,
                        devProfileImgUrl: devData.devProfileImgUrl,
                        devTitle: devData.devTitle,
                        devLinks: devData.devLinks,
                        appStatus: null
                    }
                })
                .then(() => {
                    return response.status(200).json({message: "success"})
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npGetProjectApplications = (request, response) => {
    let user
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user

    fs
        .collection("np_applications")
        .doc(user.uid)
        .get()
        .then((doc) => {
            let docData = doc.data()
            return response.status(200).json(docData)
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.npAppUpdateProject = (request, response) => {
    let user, data
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("np_applications")
        .doc(user.uid)
        .update({
            [`${data.projectId}.projectInfo.projTitle`]: data.projTitle,
            [`${data.projectId}.projectInfo.projDescription`]: data.projDescription,
            [`${data.projectId}.projectInfo.projGithub`]: data.projGithub,
        })
        .then(() => {
            return response.status(200).json({message: "DevProjectModal Updated"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}


