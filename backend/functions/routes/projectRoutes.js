const projectApp = require('express')();
const cors = require('cors');

projectApp.use(cors({origin: true}))

const {
    auth
} = require("../util/auth")

const {
    projCreate, // verifies np account then creates project document and adds project to the allProjects document
    projDelete, // deletes the project document and the reference in the allProjects document
    projUpdate, // verifies np owns the project then updates the title, desc and github on the project and allProjects document
    projLoad, // gets a project document given its id
    projGetAll, // gets the allProjects document
    projAddDev, // verifies if np owns the project and then adds the developer profile to the project document (using uid)
    projRemoveDev // verifies if np owns the project and then removes the developer profile from the project document (using uid)
} = require("../API/projects")

const {
    npAddProject, // add project to the np profile document
    npDeleteProject, // verifies the np owns the project and deletes it from the np profile
    npUpdateProject, // updates the project title, desc, and github on the np profile document
} = require("../API/nonProfit")

const {
    devUpdateProject, // updates the project information on the developer profile
    devAddProject, // adds a project to the developer profile
    devDeleteProject, // deletes a project from the developers profile
} = require("../API/developers")

const {
    npAppAddProject, // adds the project to the np applications document
    npAppDeleteProject, // deletes the project from the np applications document -- erases all applications as well
    npAppUpdateProject // updates the project information in the np applications document
} = require("../API/npApplications")

const {

} = require("../API/devApplications")

// creates a project --- post from np account so user = np
projectApp.post("/create-project", auth, projCreate, npAddProject, npAppAddProject)

// deletes a project --- post from np account so user = np
projectApp.post("/delete-project", auth, npDeleteProject, projDelete, npAppDeleteProject)

// updates a project --- post from np account so user = np
projectApp.post("/update-project", auth, projUpdate, npUpdateProject, devUpdateProject, npAppUpdateProject)

// adds a developer to a project --- post from np account so user = np
projectApp.post("/add-Dev", auth, projAddDev, devAddProject)

// deletes a developer from a project --- post from np account so user = np
projectApp.post("/delete-Dev", auth, projRemoveDev, devDeleteProject)

// loads a specific project using its id --- not a restricted route so no user object from auth
projectApp.get("/get-project", projLoad)

// loads the all the project summaries for the explore page --- not a restricted route so no user object from auth
projectApp.get("/get-all-projects", projGetAll)


module.exports = projectApp
