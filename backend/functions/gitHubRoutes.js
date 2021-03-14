const ghApp = require('express')();

const {
    pushes
} = require("./API/gitHub")

ghApp.post("pushes", pushes)

module.exports = ghApp