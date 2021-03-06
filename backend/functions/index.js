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


app.post("/signup", npSignUp)
app.post("/login", npLogin)
app.get("/getNpAccount", auth, getNpAccount)
app.post("/updateNpCredentials", auth, updateNpAccountCredentials)
app.post("/updateNpProfileImg", auth, updateNpProfileImg)
exports.api = functions.https.onRequest(app);
