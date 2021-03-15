const { admin, fs, firebase, FieldValue} = require('../util/admin');
const { createAppAuth } = require('@octokit/auth-app');



// creates a JWT token
async function createJWT(installation_id) {
    const auth = createAppAuth({
        appId: 105035,
        privateKey: privateKey,
        installationId: installation_id,
        clientId: clientID,
        clientSecret: clientSecret
    })
    const { token } = await auth({ type: 'installation' });
    return token;
}

exports.push = (request, response, next) => {
    // endpoint for commit events ---

    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let repository = data["repository"]
    let commits = data["commits"]
    let installation_id = data.installation.id

    // token is a JWT token with app auth
    const token = createJWT(installation_id).then((token) => { return token })

    // request object to pass into fetch api
    let reqObj = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "accept": "application/vnd.github.v3+json"
        }
    }

    let commitArr = []
    commits.forEach((commit) => {
        // creates the unique url for each commit
        let url = `https://api.github.com/repos/${commit.author.username}/${repository.name}/commits/${commit.id}`

        // get request to each commit url through GitHub Commit API
        fetch(url, reqObj)
            .then((response) => {
                // stores commit info that we need in a dictionary inside of an array
                commitArr.push({
                    "repo": {
                        "repoID": repository.id,
                        "repoName": repository.name
                    },
                    "commitID": commit.id,
                    "commitAuthorEmail" : commit.committer.email,
                    "commitAuthorName": commit.committer.username,
                    "commitTimestamp": commit.timestamp,
                    "commitMessage": commit.message,
                    "commitURL": commit.url,
                    "commitAdditions": response.body.stats.additions,
                    "commitDeletions": response.body.stats.deletions,
                    "commitTotal": response.body.stats.total,
                })
            })
            .catch((err) => {
                return response.status(500).json({message: "A github error occurred"})
            })
    })

    // return no commits if no commit summaries was added to commitArr
    if (commitArr.length === 0) return response.status(400).json({message: "No commits"})

    // save the newly created summaries to the request body and pass on to the next function
    request.body.commitSummaries = commitArr

    return next()
}

// this function is quite large and doesn't follow the single functionality rule but it is purposefully so in order to
// reduce compute time
exports.updateDevCommits = (request, response, next) => {

    let summaries = request.body.commitSummaries
    let authorEmail, authorUid

    let batch = fs.batch()

    let commitDocCol = fs.collection("commits")
    let commitDocRef

    let devDocCol = fs.collection("dev_accounts")
    let devDocRef

    summaries.forEach((commit) => {
        // retrieves the uid of the user whose email matches the commit -- if the email is still the same skip
        if (!(authorEmail === commit.commitAuthorEmail)) {
            authorEmail = commit.commitAuthorEmail
            admin
                .auth()
                .getUserByEmail(commit.commitAuthorEmail)
                .then((userRecord) => {
                    authorUid = userRecord.uid
                })
                .catch((err) => {
                    return response.status(500).json({error: err.message})
                })
        }
        // creates the commit document if it doesn't exist otherwise it appends the commit to the document
        commitDocRef = commitDocCol.doc(authorUid)
        batch.set(commitDocRef, {
            [commit.commitID]: {
                "commitAuthorName": commit.commitAuthorName,
                "commitTimestamp": commit.commitTimestamp,
                "commitMessage": commit.commitMessage,
                "commitURL": commit.commitURL,
                "commitAdditions": commit.commitAdditions,
                "commitDeletions": commit.commitDeletions,
                "commitTotal": commit.commitTotal,
                "repo": {
                    "repoID": commit.repo.repoID,
                    "repoName": commit.repo.repoName
                }

            }
        },  { merge: true })

        let newLevel, newXP
        devDocRef = devDocCol.doc(authorUid)

        devDocRef
            .get()
            .then((doc) => {
                let data = doc.data()
                newXP = data.gamification.devXP + commit.commitTotal > 200 ? 200 : commit.commitTotal
                newLevel = Math.ceil(newXP / 400)
            })
            .catch((err) => {
                return response.status(500).json({error: err.message})
            })

        batch
            .update(devDocRef, {"gamification.devLevel": newLevel})
            .update(devDocRef, {"gamification.devXP": newXP})

    })

    // commit the changes to the dev commit document
    batch
        .commit()
        .then(() => {
            return next()
        })
        .catch((err) => {
            return response.status(500).json({error: err.message})
        })
}


exports.updateProjectCommits = (request, response) => {
    // TODO: find project by the repo id stored in the project document and add the commits to it
}