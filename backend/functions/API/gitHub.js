const { admin, fs } = require('../util/admin');
const { createAppAuth } = require('@octokit/auth-app');

// creates a JWT token
async function createJWT(installation_id) {
    const auth = createAppAuth({
        appId: process.env.GH_APP_ID,
        privateKey: process.env.GH_PRIVATE_KEY_105035,
        installationId: installation_id,
        clientId: process.env.GH_CLIENT_ID_105035,
        clientSecret: process.env.GH_CLIENT_SECRET_105035
    })
    const { token } = await auth({ type: 'installation' });
    return token;
}

exports.push = (request, response, next) => {
    // endpoint for commit events

    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let commits = data["commits"]

    let token
    // token is a JWT token with app auth
    token = createJWT(data.installation.id)
        .then((token) => { return token })
        .catch((err) => {
            return response.status(400).json({error: "There was an error with the token", token: token})
        })
    console.log(token)

    // request object to pass into fetch api
    let reqObj = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "accept": "application/vnd.github.v3+json"
        }
    }

    let debugRes
    let commitArr = []
    commits.forEach((commit) => {
        // creates the unique url for each commit
        let url = `https://api.github.com/repos/${commit.author.username}/${data.repository.name}/commits/${commit.id}`
        console.log(url)

        // get request to each commit url through GitHub Commit API
        fetch(url, reqObj)
            .then((res) => {
                debugRes = res
                // stores commit info that we need in a dictionary inside of an array
                commitArr.push({
                    [commit.id]: {
                        "repo": {
                            "repoID": data.repository.id,
                            "repoName": data.repository.name
                        },
                        "authorEmail" : commit.committer.email,
                        "authorName": commit.committer.username,
                        "timestamp": commit.timestamp,
                        "Message": commit.message,
                        "url": commit.url,
                        "changes": {
                            "additions": res.body.stats.additions,
                            "deletions": res.body.stats.deletions,
                            "total": res.body.stats.total
                        }
                    }
                })
            })
            .catch((err) => {
                console.log(err)
                return response.status(500).json({message: "A github error occurred",
                data: debugRes})
            })
    })

    // return no commits if no commit summaries was added to commitArr
    if (commitArr.length === 0) return response.status(400).json({message: "No commits"})

    // save the newly created summaries to the request body and pass on to the next function
    request.body = commitArr

    return next()
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