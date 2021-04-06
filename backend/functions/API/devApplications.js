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
            if (!doc.exists) return response.status(404).json({message: "Project doesn't exist"})

            // add project data and current timestamp to the request body
            data.projectData = doc.data()
            data.creationDate = Date.now()
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
                        creationData: data.creationDate,
                        appStatus: null
                    }
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

exports.devAppAccepted = (request, response) => {

}

exports.devAppRejected = (request, response) => {

}

exports.devAppGetApplications = (request, response) => {

}
