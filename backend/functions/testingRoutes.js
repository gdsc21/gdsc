const testingApp = require('express')();

const {
    updateTest
} = require("./API/testing")


testingApp.post("/update-test", updateTest)

module.exports = testingApp