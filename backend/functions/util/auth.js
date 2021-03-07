const { admin, fs } = require('../util/admin');

// checks if an authorized token is included in the request if so store correct username in request and pass to next
exports.auth = (request, response, next) => {
    let token
    // check for token -- assign to token if it exists and return unauthorized error code if not
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        token = request.headers.authorization.split('Bearer ')[1];
    } else {
        return response.status(401).json({ error: 'Unauthorized' });
    }
    admin
        // verify token with Firebase authentication and get the document associated with that account
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            request.user = decodedToken;
            return fs
                .collection('non_profit_accounts')
                .where('userCredentials.userId', '==', String(request.user.uid))
                .limit(1)
                .get();
        })
        // get the username for the account and assign it to the request
        .then((data) => {
            request.user.username = data.docs[0].data().userCredentials.username;
            // request.user.imageUrl = data.docs[0].data().imageUrl;
            return next();

        })
        .catch((err) => {
            // console.error('Error while verifying token', err);
            return response.status(403).json(err.message);
        });
}