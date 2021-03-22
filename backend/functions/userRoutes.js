const userApp = require('express')();
const cors = require('cors');

userApp.use(cors({origin: true}))

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
userApp.post("/np-signup", npSignUp, npLogin)

// non profit login -- returns auth token
userApp.post("/np-login", npLogin)

// returns a non profits account -- any logged in user can access this
userApp.get("/get-non-profit", auth, npGetAccount)

// updates the profile info of the currently logged in non-profit -- updates non-profit/project docs
userApp.post("/update-np-info", auth, npUpdateAccount, projUpdateNpInfo)

// updates the profile image of the currently logged in non-profit
userApp.post("/update-np-profile-img", auth, npUpdateProfileImg)

// creates a project -- only available to non-profits -- creates project doc and updates non-profit doc
userApp.post("/create-project", auth, projCreate, npAddProject)

// load a project -- only available to logged in user/non-profits
userApp.get("/get-project", auth, projLoad)

// deletes a project -- only available to non-profits (must own doc) -- deletes project doc and updates non-profit doc
userApp.post("/delete-project", auth, npDeleteProject, projDelete)

// creates a developer profile -- must be called immediately after signup with GitHub -- creates developer document
userApp.post("/dev-create-profile", auth, devCreateProfile)

// retrieves a developer document -- only available to logged in users
userApp.post("/get-dev-profile", auth, devGetProfile)

// adds a developer to a project -- only available to non-profits -- updates project/developer docs
userApp.post("add-dev-to-project", auth, projAddDev, devAddProject)

// removes a developer from a project -- only available to non-profits -- updates project/developer docs
userApp.post("remove-dev-from-project", auth, projRemoveDev, devDeleteProject)

module.exports = userApp