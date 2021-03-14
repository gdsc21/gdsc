// const { admin, fs, firebase, FieldValue} = require('../util/admin');


exports.pushes = (request, response) => {
    console.log(request)
    return response.status(200).json({body: request.body})
    // let data
    // if (typeof request.body != "object")
    //     data = JSON.parse(request.body)
    // else data = request.body
    //
    // console.log(data.payload)
    // return response.status(200).json({payload: data.payload})
}