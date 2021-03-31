const { admin, fs, firebase, FieldValue} = require('../util/admin');


exports.updateTest = (request, response) => {
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    fs
        .collection("dev_accounts")
        .doc("testing")
        .update({
            "1.name1": data.nameOne,
            "1.name2": data.nameTwo,
            2: data.partTwo.something
        })
        .then(() => {
            return response.status(200).json({message: "update success"})
        })
        .catch((err) => {
            console.log(err)
            return response.status(400).json({error: err.message})
        })
}