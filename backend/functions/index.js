const functions = require('firebase-functions');
const userApp = require("./userRoutes")
const ghApp = require("./gitHubRoutes")

exports.userRoutes = functions.https.onRequest(userApp);
exports.github = functions.https.onRequest(ghApp);

