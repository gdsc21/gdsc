const admin = require('firebase-admin');
const firebase = require('firebase');
const config = require('../util/config');

admin.initializeApp();

// if (!firebase.apps.length) {
//     firebase.initializeApp(config);
// }else {
//     firebase.app(); // if already initialized, use that one
// }
firebase.initializeApp(config);

const fs = admin.firestore().settings({ ignoreUndefinedProperties: true });
const FieldValue = admin.firestore.FieldValue

module.exports = { admin, fs, firebase, FieldValue };