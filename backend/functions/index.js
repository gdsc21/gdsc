const functions = require('firebase-functions');
const app = require('express')();

const {
    npSignUp,
    npLogin,
    npGetAccount,
    npUpdateAccount,
    npUpdateProfileImg,
    npAddProject,
    npDeleteProject
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

// non profit signup -- logs in automatically after signup -- returns auth token
app.post("/np-signup", npSignUp, npLogin)

// non profit login -- returns auth token
app.post("/np-login", npLogin)

// returns a non profits account -- any logged in user can access this
app.get("/get-non-profit", auth, npGetAccount)

// updates the profile info of the currently logged in non-profit -- updates non-profit/project docs
app.post("/update-np-info", auth, npUpdateAccount, projUpdateNpInfo)

// updates the profile image of the currently logged in non-profit
app.post("/update-np-profile-img", auth, npUpdateProfileImg)

// creates a project -- only available to non-profits -- creates project doc and updates non-profit doc
app.post("/create-project", auth, projCreate, npAddProject)

// deletes a project -- only available to non-profits (must own doc) -- deletes project doc and updates non-profit doc
app.post("/delete-project", auth, npDeleteProject, projDelete)

// creates a developer profile -- must be called immediately after signup with GitHub -- creates developer document
app.post("/dev-create-profile", auth, devCreateProfile)

// retrieves a developer document -- only available to logged in users
app.post("/get-dev-profile", auth, devGetProfile)

// adds a developer to a project -- only available to non-profits -- updates project/developer docs
app.post("add-dev-to-project", auth, projAddDev, devAddProject)

// removes a developer from a project -- only available to non-profits -- updates project/developer docs
app.post("remove-dev-from-project", auth, projRemoveDev, devDeleteProject)


exports.api = functions.https.onRequest(app);
