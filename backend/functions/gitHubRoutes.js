const ghApp = require('express');
const router = ghApp.Router()

router.use((request, response, next) => {
    switch (request.url) {
        case "/push":
            request.url = "/push"
            break
    }

    next()
})

const {
    push
} = require("./API/gitHub")

router.post("/push", push)

module.exports = router