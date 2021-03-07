const isEmail = (email) => {
    //TODO edit regex to check for company email
    let tString = String(email)
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!tString.match(emailRegEx);
};

function isEmpty(some_string) {
    let tString = String(some_string).trim()
    return tString === ""
}

exports.validateNpSignUp = (data) => {
    let errors = {};
    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (isEmpty(data.nonProfitName)) errors.nonProfitName = 'Must not be empty';
    if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';
    if (isEmpty(data.country)) errors.country = 'Must not be empty';

    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passowrds must be the same';
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}

exports.validateNpLogin = (data) => {
    let errors = {};
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be  empty';
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};