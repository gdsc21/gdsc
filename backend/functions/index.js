const functions = require('firebase-functions');
const userApp = require("./userRoutes")
const ghApp = require("./gitHubRoutes")
const devCreate = require("./API/triggerFunctions")


// ghApp.use(cors({ origin: true }))
// userApp.use(cors({ origin: true }))

exports.userRoutes = functions.https.onRequest(userApp);
exports.github = functions.https.onRequest(ghApp);
exports.createDev = devCreate.createDevDoc

