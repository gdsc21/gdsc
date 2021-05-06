const npApp = require('express')();
const cors = require('cors');

npApp.use(cors({origin: true}))

const {
    auth
} = require("../util/auth")

const {
    projUpdateNpInfo // updates the np's info in all of its projects
} = require("../API/projects")

const {
    npSignUp, // creates a non-profits profile document
    npGetAccount, // either retrieves the account of the currently logged in user or the np specified by the passed uid
    npUpdateAccount, // updates a np's display name, email, phone number, website, or country in np document
} = require("../API/nonProfit")

const {
    devUpdateNpInfo
} = require("../API/developers")

const {

} = require("../API/npApplications")

const {
} = require("../API/devApplications")


// signs up a non-profit
npApp.post("/np-sign-up", npSignUp)

// updates a non profits profile in all locations except developer applications
npApp.post("/np-update", auth, npUpdateAccount, projUpdateNpInfo, devUpdateNpInfo)

// gets a non-profits profile --- post from np OR Dev
npApp.get("/get-np", auth, npGetAccount)


module.exports = npApp
