const functions = require('firebase-functions');
const app = require('express')();

const {
    npSignUp,
    npLogin,
    npGetAccount,
    npUpdateAccount,
    npUpdateProfileImg
} = require("./API/nonProfit")

const {
    auth
} = require("./util/auth")

const {
    projCreate,
    projDelete,
    projLoad,
    projUpdateNpInfo,
    projAddDev,
    projRemoveDev
} = require("./API/projects")

const {
    devCreateProfile,
    devGetProfile,
    devAddProject,
    devDeleteProject
} = require("./API/developers")


app.post("/np-signup", npSignUp, npLogin)
app.post("/np-login", npLogin)
app.get("/get-non-profit", auth, npGetAccount)
app.post("/update-np-info", auth, npUpdateAccount, projUpdateNpInfo)
app.post("/update-np-profile-img", auth, npUpdateProfileImg)
app.post("/create-project", auth, projCreate)
app.post("/delete-project", auth, projDelete)
app.post("/dev-create-profile", auth, devCreateProfile)
app.post("/get-dev-profile", auth, devGetProfile)

// adds a developer to a project -- only available to non-profits -- updates project/developer docs
app.post("add-dev-to-project", auth, projAddDev, devAddProject)

// removes a developer from a project -- only available to non-profits -- updates project/developer docs
app.post("remove-dev-from-project", auth, projRemoveDev, devDeleteProject)

app.post

exports.api = functions.https.onRequest(app);
