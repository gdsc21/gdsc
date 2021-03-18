const functions = require("firebase-functions")
const fetch = require("node-fetch")
const { admin, firestore } = require('../util/admin');
const { createAppAuth } = require('@octokit/auth-app');
const fs = require('fs');

// creates a JWT token'
// async function createJWT(installation_id) {
//     try {
//
//         const { token } = await auth({type: "installation"})
//         return token
//     } catch (error) {
//         console.log({"SideFunc": error})
//     }
//
// }

exports.push = async (request, response, next) => {
    // try {
    //     const pem = fs.readFileSync("pemKey.pem", "utf8")
    // } catch (error) {
    //     console.log(error)
    // }
    // endpoint for commit events
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let commits = data["commits"]

    let appAuth, token

    const auth = createAppAuth({
        appId: functions.config().gh.appid,
        privateKey: functions.config().gh.privatekey,
        installationId: data.installation.id,
        clientId: functions.config().gh.clientid,
        clientSecret: functions.config().gh.clientsecret
    })

    try {
        // token = await createJWT(data.installation.id)
        appAuth = await auth({type: "installation"})
        console.log("Auth Object:", appAuth)
    }
    catch(error) {
        console.log({"MainFunc": error})
    }
    // if (token === "undefined") return response.status(500).json({error: "The token app token is invalid"})
    // console.log(token)
    return response.status(200).json({token: token})

    //
    // // request object to pass into fetch api
    // let reqObj = {
    //     method: "GET",
    //     headers: {
    //         "Authorization": "Bearer " + token,
    //         "accept": "application/vnd.github.v3+json"
    //     }
    // }
    //
    // let debugRes
    // let commitArr = []
    // commits.forEach((commit) => {
    //     // creates the unique url for each commit
    //     let url = `https://api.github.com/repos/${commit.author.username}/${data.repository.name}/commits/${commit.id}`
    //     console.log(url)
    //
    //     // get request to each commit url through GitHub Commit API
    //     fetch(url, reqObj)
    //         .then((res) => {
    //             debugRes = res
    //             // stores commit info that we need in a dictionary inside of an array
    //             commitArr.push({
    //                 [commit.id]: {
    //                     "repo": {
    //                         "repoID": data.repository.id,
    //                         "repoName": data.repository.name
    //                     },
    //                     "authorEmail" : commit.committer.email,
    //                     "authorName": commit.committer.username,
    //                     "timestamp": commit.timestamp,
    //                     "Message": commit.message,
    //                     "url": commit.url,
    //                     "changes": {
    //                         "additions": res.body.stats.additions,
    //                         "deletions": res.body.stats.deletions,
    //                         "total": res.body.stats.total
    //                     }
    //                 }
    //             })
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //             return response.status(500).json({message: "A github error occurred",
    //             data: debugRes})
    //         })
    // })
    //
    // // return no commits if no commit summaries was added to commitArr
    // if (commitArr.length === 0) return response.status(400).json({message: "No commits"})
    //
    // // save the newly created summaries to the request body and pass on to the next function
    // request.body = commitArr
    //
    // return next()
}

// this function is quite large and doesn't follow the single functionality rule but it is purposefully so in order to
// reduce compute time
exports.updateDevCommits = (request, response, next) => {

    let commitArr = request.body
    let authorEmail, authorUid

    let batch = fs.batch()

    let commitDocCol = fs.collection("commits")
    let commitDocRef

    commitArr.forEach((commit) => {
        // retrieves the uid of the user whose email matches the commit -- if the email is still the same skip
        if (!(authorEmail === commit.id.authorEmail)) {
            authorEmail = commit.id.authorEmail
            admin
                .auth()
                .getUserByEmail(commit.id.authorEmail)
                .then((userRecord) => {
                    authorUid = userRecord.uid
                    // remove the email so it is not included in the commit info in firestore
                    delete commit.id.authorEmail
                })
                .catch((err) => {
                    if (err.code === "auth/user-not-found")
                        return response.status(400).json({message: "User not found"})
                    else
                        return response.status(501).json({error: err.message})
                })
        }
        // creates the commit document if it doesn't exist otherwise it appends the commit to the document
        commitDocRef = commitDocCol.doc(authorUid)
        batch.set(commitDocRef, commit,  { merge: true })

        let newLevel, newXP
        let devDocRef = fs.collection("dev_accounts").doc(authorUid)

        // updates developer xp and level
        devDocRef
            .get()
            .then((doc) => {
                let data = doc.data()
                newXP = data.gamification.devXP + commit.id.total > 200 ? 200 : commit.total
                newLevel = Math.ceil(newXP / 400)

                batch
                    .update(devDocRef, {"gamification.devLevel": newLevel})
                    .update(devDocRef, {"gamification.devXP": newXP})

            })
            .catch((err) => {
                return response.status(502).json({error: err.message})
            })
    })

    // commit the changes to the dev commit document
    batch
        .commit()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(503).json({error: err.message})
        })
}


exports.updateProjectCommits = (request, response) => {
    // TODO: find project by the repo id stored in the project document and add the commits to it
}