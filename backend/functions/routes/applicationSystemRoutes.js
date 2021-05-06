const applicationsApp = require('express')();
const cors = require('cors');

applicationsApp.use(cors({origin: true}))

const {
    auth
} = require("../util/auth")

const {
    npAcceptDev,
    npRejectDev,
    npAddDevApplied,
    npGetProjectApplications
} = require("../API/npApplications")

const {
    devAppAccepted,
    devAppRejected,
    devAppApply,
    devAppGetApplications
} = require("../API/devApplications")

const {
    projAddDev
} = require("../API/projects")

const {
    devAddProject
} = require("../API/developers")



// accepts a developers application to a project --- post from np account so user = np
applicationsApp.post("/accept-Dev", auth, projAddDev, devAddProject, npAcceptDev,  devAppAccepted)

// rejects a developers application to a project --- post from np account so user = np
applicationsApp.post("/reject-Dev", auth, npRejectDev, devAppRejected)

// applies a developer to a project --- post from Dev account so user = Dev
applicationsApp.post("/apply-project", auth, devAppApply, npAddDevApplied)

// gets all the applications an np has received --- get from np so user = np
applicationsApp.get("/np-get-applications", auth, npGetProjectApplications)

// gets all the applications a developer has sent --- get from Dev so user = Dev
applicationsApp.get("/Dev-get-applications", auth, devAppGetApplications)


module.exports = applicationsApp

