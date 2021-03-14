const { admin, fs, firebase, FieldValue} = require('../util/admin');


exports.pushes = (request, response) => {
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body


}