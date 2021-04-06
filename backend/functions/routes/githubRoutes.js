const ghApp = require('express')();
// const router = ghApp.Router()

// router.use((request, response, next) => {
//     switch (request.url) {
//         case "/push":
//             request.url = "/push"
//             break
//     }
//
//     next()
// })
//

const cors = require('cors');

ghApp.use(cors({origin: true}))

const {
    push,
    updateDevCommits
} = require("../API/github")

ghApp.post("/push", push, updateDevCommits)

module.exports = ghApp