const functions = require('firebase-functions');
const { admin, fs, firebase, FieldValue} = require('../util/admin');


exports.createDevDoc = functions.auth.user().onCreate((user) => {
    fs
        .collection("dev_accounts")
        .doc(user.uid)
        .set({
            devDisplayName: user.displayName,
            devProfileImgUrl: user.photoURL,
            devLinks: {
                devWebsite: "",
                devGitHub: "",
                devLinkedIn: "",
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
        .catch((err) => {
            console.log("Error:", err.statusCode, "Message:", err.message)
            return false
        })
    return true
})

exports.DeleteDevAccount = functions.auth.user().onDelete((user) => {

})