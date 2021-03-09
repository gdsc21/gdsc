const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');


firebase.initializeApp(config)

exports.createProject = (request, response) => {
    /**
     * Creates a new project document with a random uid as the file name and inserts a title, description and npInfo
     * @param {request} body={title:, description:, npInfo: {npEmail:, npDisplayName:, npWebsite:}}
     * @return success: status=201 --- json={message: "Project successfully created!}
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
            npInfo: npInfo
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
                    return response.status(201).json({message: "Project successfully created!"})
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
    const data = JSON.parse(request.body)
    fs
        .collection("projects")
        .doc(data.projectId)
        .delete()
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
    fs
        .collection("np_accounts")
        .doc(request.user.uid)
        .update({[`npProjects.${data.projectId}`]: firebase.firestore.FieldValue.delete()})
        .then(() => {
            return response.status(200).json({message: "Successfully deleted the project"})
        })
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