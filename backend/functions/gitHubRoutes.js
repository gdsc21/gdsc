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
// const {
//     push
// } = require("./API/gitHub")

// const functions = require("firebase-functions")
// const fetch = require("node-fetch")
// const { admin, fs } = require('../util/admin');
const { createAppAuth } = require('@octokit/auth-app');

// creates a JWT token'
async function createJWT(installation_id) {
    const auth = createAppAuth({
        appId: 105035,
        privateKey: "MIP6e3bo4H9AoGRMUOkrcrHkWgWZ+mt1wD5Kmvgorwh0PUbwZ7uUUU+QOUtYRaY/FVtaEE9v/oZK3IxJm3KuY3y6YO7Ep9pqUQ28OgnedaxAoGAHsiAfaxXfMIIEogIBAAKCAQEA8x4lqTlO8n/NFZKFzvivjsjom6o0chkZ47GxkpnuWWrwxJs2MrGUsYz5XLKl8DrHtyZOas4DfR2oO9pUnt6/dW/RnpzAX00VsGevdoZb8hefeQRU4tLSdhoXDQS0Vedtg/CH+iAo/znA4XCJ5JW5DHwoBx1J68q0QzExKGVwIEwCb0j58BvQf1LhFvaCKRkBe2LLvRKwGREPhyl6Mjb3P72vsevU+da25QQ2fuRjPqPmTc4dvH0VupBdecT134MV2GG8bynQyapi4C80jZrV9LzreY1tjQ0LUVmUxJkGUtqXMvzY2KYX0CpxnUtljm9i3GSfBp+UVXmhv4OJGN/hjwIDAQABAoIBADuz5Y+/ERIgLF7l0pJXI9WupODFVYfHfkIaOv9DafLvfhzp+M9OKLPJaNtIy9NIvA7QC2XTHaw2AkBgh3NURDQ0t4d5+wvsRC1D6ST0LdQv1OvFEot5NlHmak66HwcRhCVohhv4ldjHeARkvJgz5HOaccH9gU+0QbxWcjn3XyeuyEQ5WkBytO1p0udJ4scF//TsEpRIHJwSfO9hIlm4IZv/zozca4kzKGUEqzP1l1Wh4AuIkvR016vUAmTFerWz0g+zutwF5UN0kfOFeXVG10qrriRfOqgKpYcWvDZRJEGWWGlmsxF87z48TcSnf+0HxjWsF79Or76VH7P+Cnx1/MECgYEA/o714FRyc689HfsnF0Il59phr/8NBFEXJ71Z70Uwv8PV7C5WMlF+OwBhHtg1VWkxB49BSqSPL6+hbdPyjw8ewk5jZlmIKGIx7F9vSOgOF1eQoIn/sM1hXf6PBu6VZa6oD5PqYBUaJTyh70IpOX+XdQbYyhlqnu1In/ulaIKdvjECgYEA9H6Z0B961HXBc9AM+ZHGCYRO9oProjv7KXPh5zO8tRR9f84bb1lf3vz1Cha3hw3VhxOsDqm7YJuf2GFERNnEsSQJLPQ/XeBc7BUqu7llemoY+CAcRoLSwBjrRN8vxmRWw9DXi+FrS7Kveu2k+nPzRMGgXETgemW6Xw4fn3MY678CgYB/5hRjwgo/Vay/g5EAfpvNAkxSwTMpGBUqQlkNfxYfQ6YYJK/qWEe0HVyuwrMJVvDre26ysju/Gd9h7zvP5SjvN7N5mUJwB+ZNfSXM28s4ryZbgvqVOpvRPjVepkEp9bc7HHaGEBQy4WP7cqKD4TeX9Pi3kk2fzFjRCP7yo63eAQKBgA7zzyRTSIfFy9bxWlnI+HuMg+e/maGKWYnndGFXYKsSXbp7OGJO7PYOMk4zpXW0+uIP6e3bo4H9AoGRMUOkrcrHkWgWZ+ mt1wD5Kmvgorwh0PUbwZ7uUUU+QOUtYRaY/FVtaEE9v/oZK3IxJm3KuY3y6YO7Ep9pqUQ28OgnedaxAoGAHsiAfaxXfGuzhqgDSPSPy4ceVsLcb0Xs87VdyX0YIvOdw36gf3IQ4qo1ZJ/b/qC5lv1LWOmyc86j24hdtXdXAe0QO9ZT5RFbuMqy2F5VAZOOlyW/d1dRZqzhC8lrKpPyuheUAek+nMfKnbeDw4sYNXjWFnokAEEFgmToxncswL8=",
        installationId: installation_id,
        clientId: "Iv1.1d26e7ddd2fe7a0d",
        clientSecret: "52d7f7eab675a5f31f0dab0b05b4a82cdfa5b80c"
    })

    const { token } = await auth({type: "installation"})
    return token
}

ghApp.post("/push", async(request, response) => {
    let token = await createJWT(data.installation.id)
    if (token === "undefined") return response.status(500).json({error: "The token app token is invalid"})
    console.log(token)
    return response.status(200).json({token: token})
})

module.exports = ghApp