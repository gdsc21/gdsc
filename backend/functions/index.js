const functions = require('firebase-functions');
const app = require('express')();

const {
    npSignUp,
    npLogin,
    getNpAccount,
    updateNpAccountCredentials,
    updateNpProfileImg
} = require("./API/nonProfit")

const {
    auth
} = require("./util/auth")

const {
    createProject,
} = require("./API/projects")


app.post("/signup", npSignUp, npLogin)
app.post("/login", npLogin)
app.get("/getNpAccount", auth, getNpAccount)
app.post("/updateNpCredentials", auth, updateNpAccountCredentials)
app.post("/updateNpProfileImg", auth, updateNpProfileImg)
app.post("/create-project", auth, createProject)
exports.api = functions.https.onRequest(app);
