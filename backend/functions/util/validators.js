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
    let errors = {}
    if (isEmpty(data.npEmail)) {
        errors.npEmail = 'Must not be empty';
    } else if (!isEmail(data.npEmail)) {
        errors.npEmail = 'Must be valid npEmail address';
    }

    if (isEmpty(data.npName)) errors.npName = 'Must not be empty';
    if (isEmpty(data.npUsername)) errors.npUsername = 'Must not be empty';
    if (isEmpty(data.npCountry)) errors.npCountry = 'Must not be empty';

    if (isEmpty(data.npPassword)) errors.npPassword = 'Must not be empty';
    if (data.npPassword !== data.npConfirmPassword) errors.npConfirmPassword = 'Passowrds must be the same';
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}

exports.validateNpLogin = (data) => {
    let errors = {};
    if (isEmpty(data.npEmail)) errors.npEmail = 'Must not be empty';
    if (isEmpty(data.npPassword)) errors.npPassword = 'Must not be  empty';
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}

exports.validateNpCredentials = (data) => {
    let errors = {}
    if (isEmpty(data.npEmail)) {
        errors.npEmail = 'Must not be empty';
    } else if (!isEmail(data.npEmail)) {
        console.log(data.npEmail)
        errors.npEmail = 'Must be valid npEmail address';
    }

    if (isEmpty(data.npDisplayName)) errors.npDisplayName = 'Must not be empty';
    if (isEmpty(data.npCountry)) errors.npCountry = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}