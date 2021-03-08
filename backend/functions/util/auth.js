const { admin, fs } = require('../util/admin');

// checks if an authorized token is included in the request if so store correct npUsername in request and pass to next
exports.auth = (request, response, next) => {
    let token
    // check for token -- assign to token if it exists and return unauthorized error code if not
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        token = request.headers.authorization.split('Bearer ')[1];
    } else {
        return response.status(401).json({ error: 'Unauthorized' });
    }
    console.log(token)
    admin
        // VERY IMPORT: request.user assignment is used by all endpoints that require user info so always put auth
        // first if the end objective utilizes user info
        // verify token with Firebase authentication - get uid on the account - get document associated with that uid
        .auth()
        .verifyIdToken(token)
        // decodedToken contains name - uid - email - phone number - etc
        .then((decodedToken) => {
            request.user = decodedToken // assigns request.user to the decodedToken user information --- used in next()
            return next()
        })
        .catch((err) => {
            if (err.code === "auth/id-token-expired" || err.code === "auth/id-token-revoked") {
                return response.status(409).json({error: "Login token timed out. Please log back in."})
            }
            return response.status(403).json(err.message);
        });
}