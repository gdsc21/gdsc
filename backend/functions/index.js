const functions = require('firebase-functions')
const devApp = require("./routes/devRoutes")
const npApp = require("./routes/npRoutes")
const projectApp = require("./routes/projectRoutes")
const applicationsApp = require("./routes/applicationSystemRoutes")
const ghApp = require("./routes/githubRoutes")
const devCreate = require("./API/triggerFunctions")
const testingApp = require("./routes/testingRoutes")

exports.devApp = functions.https.onRequest(devApp);
exports.npApp = functions.https.onRequest(npApp);
exports.projectApp = functions.https.onRequest(projectApp);
exports.applicationsApp = functions.https.onRequest(applicationsApp);

exports.github = functions.https.onRequest(ghApp);
exports.createDev = devCreate.createDevDoc
exports.testingRoutes = functions.https.onRequest(testingApp)

