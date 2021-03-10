const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');


if (!firebase.apps.length) {
    firebase.initializeApp(config);
}else {
    firebase.app(); // if already initialized, use that one
}

exports.createProject = (request, response) => {
    /**
     * Creates a new project document with a random uid as the file name and inserts a title, description and npInfo
     * @param {request} body={title:, description:, npInfo: {npEmail:, npDisplayName:, npWebsite:}}
     * @return success: status=201 --- json={projectId:}
     *          failure: status=500 --- json={error: err.message}
     */
    const data = JSON.parse(request.body)
    const npInfo = data.npInfo
    npInfo.npUid = request.user.uid

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
            fs
                .collection("np_accounts")
                .doc(request.user.uid)
                .update({
                    [`npProjects.${projectDoc.id}`]: {
                        title: data.title,
                        description: data.description,
                    }})
                .then(() => {
                    return response.status(201).json({projectId: projectDoc.id})
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        })
}

exports.deleteProject = (request, response) => {
    /**
     * Deletes a created project and returns a 500 error if the project doesn't exist
     * @param {request} body={projectId:} --- user=decodedToken
     * @param {response}
     * @return success: status=200 --- json={message: Successfully deleted the project}
     *          failure: status=500 --- json={error: err.message}
     */
    let data, projectId
    if (typeof request.body != "object") {
        data = JSON.parse(request.body)
        projectId = data.projectId
    } else projectId = request.body.projectId

    // delete project from non profit account document
    let projects
    let npDocRef = fs.collection("np_accounts").doc(request.user.uid)
    npDocRef
        .get()
        .then((npDoc) => {
            projects = npDoc.data().npProjects
            if (!(projectId in projects)) {
                return response.status(400).json({message: "Cannot delete this project"})
            } else {
                delete projects[projectId]
                console.log(projects)
                npDocRef
                    .update({"npProjects": projects})
                    .then(() => {
                        return response.status(200).json({message: "Successfully deleted the project!"})
                    })
                    .catch((err) => {
                        return response.status(500).json({error: err.message})
                    })
            }
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })

    // delete project document
    fs
        .collection("projects")
        .doc(projectId)
        .delete()
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.loadProject = (request, response) => {
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

exports.updateNpInfo = (request, response) => {
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

exports.updateDevInfo = (request, response) => {

}

exports.addDev = (request, response) => {

}

exports.removeDev = (request, response) => {

}

exports.addCommit = (request, response) => {

}


