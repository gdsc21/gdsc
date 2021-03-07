const functions = require('firebase-functions');
const app = require('express')();

const {
    npSignUp,
    npLogin,
    npLogOut,
    getNpAccount,
} = require("./API/nonProfit")

const {
    auth
} = require("./util/auth")


app.post("/signup", npSignUp)
app.post("/login", npLogin)
app.post("/logout", auth, npLogOut)
app.get("/getNpAccount", auth, getNpAccount)
exports.api = functions.https.onRequest(app);
