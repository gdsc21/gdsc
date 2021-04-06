const devApp = require('express')();
const cors = require('cors');

devApp.use(cors({origin: true}))

const {
    auth
} = require("../util/auth")

const {
} = require("../API/projects")

const {
} = require("../API/nonProfit")

const {

} = require("../API/developers")

const {

} = require("../API/npApplications")

const {
} = require("../API/devApplications")