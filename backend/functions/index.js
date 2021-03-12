const functions = require('firebase-functions');
const app = require('express')();

const {
    npSignUp,
    npLogin,
    getNpAccount,
    updateNpAccount,
    updateNpProfileImg
} = require("./API/nonProfit")

const {
    auth
} = require("./util/auth")

const {
    createProject,
    deleteProject,
    loadProject,
    updateNpInfo,
    addDev
} = require("./API/projects")

const {
    createDevProfile,
    getDevProfile,
    addProject
} = require("./API/developers")


app.post("/np-signup", npSignUp, npLogin)
app.post("/np-login", npLogin)
app.get("/get-non-profit", auth, getNpAccount)
app.post("/update-np-info", auth, updateNpAccount, updateNpInfo)
app.post("/update-np-profile-img", auth, updateNpProfileImg)
app.post("/create-project", auth, createProject)
app.post("/delete-project", auth, deleteProject)
app.post("/dev-create-profile", auth, createDevProfile)
app.post("/get-dev-profile", auth, getDevProfile)

// adds a developer to a project -- only available to non-profits -- updates project/developer docs
app.post("add-dev-to-project", auth, addDev, addProject)

exports.api = functions.https.onRequest(app);
