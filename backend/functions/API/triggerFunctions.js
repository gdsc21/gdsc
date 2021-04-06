const functions = require('firebase-functions');
const { admin, fs, firebase, FieldValue} = require('../util/admin');


exports.createDevDoc = functions.auth.user().onCreate((user) => {
    if (user.providerData[0].providerId !== "github.com") return false

    fs
        .collection("dev_accounts")
        .doc(user.uid)
        .set({
            devDisplayName: user.displayName,
            devTitle: "",
            devBio: "",
            devProfileImgUrl: user.photoURL,
            devLinks: {
                devWebsite: "",
                devGitHub: "",
                devLinkedIn: "",
            },
            gamification: {
                devLevel: 0,
                devXP: 0,
                devBadges: {}
            },
            devProjects: {},
            devCommits: {},
            devAppliedProjects: {}
        })
        .catch((err) => {
            console.log("Error:", err.statusCode, "Message:", err.message)
            return false
        })
    return true
})

exports.DeleteDevAccount = functions.auth.user().onDelete((user) => {

})