const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');


if (!firebase.apps.length) {
    firebase.initializeApp(config);
}else {
    firebase.app(); // if already initialized, use that one
}


exports.createDevProfile = (request, response) => {
    /**
     * Takes a token retrieved through Github auth - verifies it and then uses the returned user object to create an
     * associated developer document containing all the data passed in the body
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
        .doc(user.uid)
        .set({
            devName: data.devName,
            devEmail: user.email,
            devDisplayName: user.displayName, // display name is username while name is the developers actual name
            devProfileImgUrl: user.photoURL,
            devLinks: {
                devWebsite: data.devWebsite,
                devGitHub: data.devGitHub,
                devLinkedIn: data.devLinkedIn,
            },
            gamification: {
                devLevel: 0,
                devXP: 0,
                devRole: "developer",
                devBadges: {}
            },
            devProjects: {},
            devCommits: {}
        })
        .then(() => {
            return response.status(201).json({message: "Account successfully created!"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}

exports.getDevProfile = (request, response) => {
    let user
    if (typeof request.user != "object")
        user = JSON.parse(request.user)
    else user = request.user

    fs
        .collection("dev_accounts")
        .doc(user.uid)
        .get()
        .then((devDoc) => {
            if (devDoc.exists) return response.status(200).json(devDoc.data())
            else return response.status(400).json({message: "Profile doesn't exists!"})
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}