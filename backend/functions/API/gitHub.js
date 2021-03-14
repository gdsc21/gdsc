const { admin, fs } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');


if (!firebase.apps.length) {
    firebase.initializeApp(config);
}else {
    firebase.app(); // if already initialized, use that one
}