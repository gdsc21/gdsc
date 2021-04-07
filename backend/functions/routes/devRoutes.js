const devApp = require('express')();
const cors = require('cors');

devApp.use(cors({origin: true}))

const {
    auth
} = require("../util/auth")

const {
    projUpdateDevInfo
} = require("../API/projects")

const {
} = require("../API/nonProfit")

const {
    devGetProfile, // retrieves the profile of the currently logged in developer
    devUpdateProfile // update the developers profile document
} = require("../API/developers")

const {

} = require("../API/npApplications")

const {
} = require("../API/devApplications")


// retrieves a developer document -- only available to logged in users
devApp.get("/get-dev-profile", auth, devGetProfile)

// updates the developers profile in all locations except the np's application page
devApp.post("/update-dev-profile", auth, devUpdateProfile, projUpdateDevInfo)

module.exports = devApp