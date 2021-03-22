const { admin, fs } = require('../util/admin');


const isEmail = (Email) => {
    //TODO edit regex to check for company npEmail
    let tString = String(Email)
    const EmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!tString.match(EmailRegEx);
};

function isEmpty(some_string) {
    let tString = String(some_string).trim()
    return tString === ""
}

exports.validateNpSignUp = (data) => {
    if (isEmpty(data.npEmail)) {
        return { valid: false, error: "Email cannot be empty"}
    } else if (!isEmail(data.npEmail)) {
        return { valid: false, error: "Email is invalid"}
    }

    if (isEmpty(data.npDisplayName)) return { valid: false, error: "Name cannot be empty"}

    if (isEmpty(data.npPassword)) return { valid: false, error: "Password cannot be empty"}
    if (data.npPassword !== data.npConfirmPassword) return {valid: false, error: 'Passowrds do not match'}

    return { valid: true, error: ""}
}

exports.validateNpLogin = (data) => {
    if (isEmpty(data.npEmail)) return { valid: false, error: "Email cannot be empty"}
    if (isEmpty(data.npPassword)) return { valid: false, error: "Password cannot be empty"}

    return { valid: true, error: ""}
}

exports.validateNpCredentials = (data) => {
    if (isEmpty(data.npEmail)) {
        return { valid: false, error: "Email cannot be empty"}
    } else if (!isEmail(data.npEmail)) {
        return { valid: false, error: "Email is invalid"}
    }

    if (isEmpty(data.npDisplayName)) return { valid: false, error: "Name cannot be empty"}

    return { valid: true, error: ""}
}

exports.checkUserExist = (email) => {
    // check if a user with the entered email already exists if so return error otherwise move on
    admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            return true
        })
        .catch((err) => {
            if (err.code === "auth/user-not-found") return false
            else return err.message
        })
}