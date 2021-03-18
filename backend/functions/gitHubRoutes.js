const ghApp = require('express')();
const functions = require("./API/gitHub")
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
// const {
//     push
// } = require("./API/gitHub")

ghApp.post("/push", functions.push)

module.exports = ghApp