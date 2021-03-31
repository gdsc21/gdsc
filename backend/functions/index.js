const functions = require('firebase-functions');
const userApp = require("./userRoutes")
const ghApp = require("./gitHubRoutes")
const devCreate = require("./API/triggerFunctions")
const testingApp = require("./testingRoutes")

exports.userRoutes = functions.https.onRequest(userApp);
exports.github = functions.https.onRequest(ghApp);
exports.createDev = devCreate.createDevDoc
exports.testingRoutes = functions.https.onRequest(testingApp)

