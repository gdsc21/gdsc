// const { admin, fs, firebase, FieldValue} = require('../util/admin');


exports.pushes = (request, response) => {
    // return response.status(200).json({body: request.body})
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let repository = data["repository"]
    let commits = data["commits"]

    // let payload = {}
    // commits.forEach((commit) => {
    //
    // })

    let payload
    // console.log(data.payload)
    const Http = new XMLHttpRequest()
    Http.onreadystatechange = () => {
        if (this.readyState === 4 && this.status === 200) {
            payload = this.response
        }
    }

    return response.status(200).json({commits: commits, payload: payload})
}