const ghApp = require('express')();

const {
    pushes
} = require("./API/gitHub")

ghApp.post("/push", pushes)

module.exports = ghApp