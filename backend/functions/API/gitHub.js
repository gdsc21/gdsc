const functions = require("firebase-functions")
const { admin, fs } = require('../util/admin');
const { createAppAuth } = require('@octokit/auth-app');
const { Octokit } = require("@octokit/rest");



function calcXP(currentXP, additions, deletions, total) {

}

function calcLevel(xp) {

}

function calcBadges(level) {

}

exports.push = async (request, response, next) => {
    /**
     * Receives the post request from GitHub push event and saves each commits info in commitArr then saves this list
     * in the request body and passes on to the next function
     */

    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    const appOctokit = new Octokit({
        userAgent: "Push App V1",
        baseUrl: 'https://api.github.com',
        authStrategy: createAppAuth,
        auth: {
            appId: functions.config().gh.appid,
            privateKey: "-----BEGIN RSA PRIVATE KEY-----\n" +
                "MIIEpAIBAAKCAQEA7YWDF2v8zaJd32CoXV0ZHoFMFYllDxpXNyFlYb3dFN6pdEjD\n" +
                "pChE8N9gV0kvSoLg32IwLGVR6o+6hqapHjEkpd9MnR4DWQv0n8QdhJbocZcYIorU\n" +
                "nKyGXSZOLxHTfxhVuw9BiL+hrFz/ElIxS6d4/4ZnPxhoJkce9T6wsMh5yy3qVb2v\n" +
                "pOsU6oPxpP9TtXQcbCBpLENe826H+WGx9572kNzj2hLB5ghmQLY1xK4CN7YUb+4I\n" +
                "HZT6wzUdHZUXQa+SNpuxza2RAohDk1uS5wIs41a/xvSW9IGbj6GL98pfFEDk+eKV\n" +
                "cbP5pE+1644XnwQPKPn5pyUtFVAoab+j3Nza/QIDAQABAoIBAFbprO9sH2RrjmgH\n" +
                "qXQIdgGYlGupC+a738AXo05huD1DwMQBQD2YUqnFQy6NZBWi0IBNII2OQaxQDZPp\n" +
                "9iZLGzrq+9DeQ6FY45l2nMqAoeu2uykgne36n2wEcUV+A2MVV4GMcpGEdbdpjBh7\n" +
                "JPim/nqaBruqxamECsr4tpTpts9meC8iOxGO48+B7XG92mlzAcdlPfxTQsKA+GLG\n" +
                "yeTbBZ+ep/I15ohdK8/eLeDe+bhb1ZpW61ZONyyVc3XGBZLiWejKYnlk29vKdvwV\n" +
                "KrknyLyxkTQLAc58p5sxQtDTM2q2WKYLGQvCKWYkCvki9pDwVZWmev0kaDnzw47H\n" +
                "uxbkT2ECgYEA/19G7TJs/Aml36WlTiZlgQm/gTsl12f0E9hMecyjqI/0xgYwwMXp\n" +
                "oOX+ivmVPBokN85/rgHpAglli4EneoOL1qNZ1EGOP6dTMsxuEcCsLxNYO5gnbU3k\n" +
                "ryN4LSGOfrW1cZ5OuZBUxWlmA9WmfXZF6hdmLjEJ3CCpQyRyfAyJiqUCgYEA7hsA\n" +
                "Gny4Qw/tGfQ23e33DiMz9a9zN717xJGmb8HM9XqGfIymP3Go7+TwYEfOGFphR6Ac\n" +
                "yW++O0mOJrVA28UGnPqUIANT7A2bPU7MjW7xUMj6NyJMcZiJyu+w7wZV9r7LS226\n" +
                "XPRqAWyMJfvAV59Hw0jlJJ0Aqs3mv6rJYh1Xl3kCgYAHpydM/HHfq7pY1XH6wZPR\n" +
                "JiWjDc64gdkCrzy7ebJ93rKLLKxRWp0BwWK7b3dVccMcGQgigtQkx3tPjvNL7J1I\n" +
                "NWT/w2cr6SvJHe8+gPOoBYBjaM/lqqvrw7haQeMvUOq7GO9rCDRCJkJ0Yva2U9EM\n" +
                "jt71C2ssOZ5Y8MKtjQKiMQKBgQCepvcGrxvH85C0vnjgn3MCxIoWpnVLKsKRU8tm\n" +
                "o+eBmcaKrt0HYSCD2DQiszWsHGy9YP5NaluC/ZvuRs+UoE+rwXt5aT4+B0LtMtgx\n" +
                "VT8N6RxwKDZvaohF5DgszDfzVWX4OID49xK7KCyqEnky6TrT8HpeTw7mwJOEGrRc\n" +
                "39hBYQKBgQDv4Abq+K6NmT6KXU7ImfIEIn/rlXzJiD+rJVTDLBfPgCWBbQ54Tn9C\n" +
                "71peY6U5FbtwaWwR7BPpPUDKPOUE8IzVFg1eZnet4EpHLHEc1eDPbyvbveVsozWH\n" +
                "VFkE5jcwfQJIcqFReq0/22e+zfbXphk4lAXhb0W8+2WDeRPWPFKRWw==\n" +
                "-----END RSA PRIVATE KEY-----",
            installationId: data.installation.id,
            clientId: functions.config().gh.clientid,
            clientSecret: functions.config().gh.clientsecret
        }
    })

    try {
        const { token } = await appOctokit.auth({
            type: "installation",
        })
    } catch {
        return response.status(404).json({error: "Authentication with GitHub failed"})
    }

    let commitArr = []
    for (let i=0; i < data.commits.length; i++) {
        let res, commitStats
        let commit = data.commits[i]
        try {
            res = await appOctokit.repos.getCommit({
                owner: data.repository.owner.login,
                repo: data.repository.name,
                ref: commit.id
            })

            if (res.status != 200) return response.status(res.status).json({error: "Problem requesting commit"})
            commitStats = res.data.stats

        } catch {
            return response.status(400).json({error: "Commit not found"})
        }

        if (commitStats === "undefined") return response.status(400).json({error: "No stats"})
        commitArr.push({
            [commit.id]: {
                "repo": {
                    "repoID": data.repository.id,
                    "repoName": data.repository.name
                },
                "authorEmail" : commit.author.email,
                "authorName": commit.author.username,
                "timestamp": commit.timestamp,
                "Message": commit.message,
                "url": commit.url,
                "changes": {
                    "additions": commitStats.additions,
                    "deletions": commitStats.deletions,
                    "total": commitStats.total
                }
            }
        })
    }

    try {
        request.body = {commits: commitArr}
    } catch {
        return response.status(400).json({error: "Commit save to body error"})
    }

    // return response.status(200).json({error: "immediate return"})
    return next()
}

// this function is quite large and doesn't follow the single functionality rule but it is purposefully so in order to
// reduce compute time
exports.updateDevCommits = (request, response) => {
    /**
     * Updates the developers xp, level, and badges on their profile document
     */
    let commitArr = request.body.commits
    let authorEmail, authorUid

    // let commitDocCol = fs.collection("commits")
    // let commitDocRef


    // loop through the commits
    commitArr.forEach((commit) => {
        return response.status(200).json({commits: commitArr})
        // retrieves the uid of the user whose email matches the commit -- if the email is still the same skip
        if (!(authorEmail === commit.id.authorEmail)) {
            authorEmail = commit.id.authorEmail
            try {
                admin
                    .auth()
                    .getUserByEmail(commit.id.authorEmail)
                    .then((userRecord) => {
                        authorUid = userRecord.uid
                        commit.id.authorUid = authorUid
                        // remove the email so it is not included in the commit info in firestore
                        delete commit.id.authorEmail
                    })
                    .catch((err) => {
                        if (err.code === "auth/user-not-found")
                            return response.status(400).json({message: "User not found"})
                        else
                            return response.status(501).json({error: err.message})
                    })
            } catch {
                return response.status(200).json({commits: commitArr})
            }

        }


        // // creates the commit document if it doesn't exist otherwise it appends the commit to the document
        // commitDocRef = commitDocCol.doc(authorUid)
        // batch.set(commitDocRef, commit,  { merge: true })

        let newLevel, newXP
        let devDocRef = fs.collection("dev_accounts").doc(authorUid)

        // updates developer xp and level
        devDocRef
            .get()
            .then((doc) => {
                let data = doc.data()
                let game = data.gamification

                // manages adding xp + level
                newXP = game.devXP + (commit.id.changes.total > 200 ? 200 : commit.id.changes.total)
                newLevel = Math.ceil(newXP / 400)

                game.devXP = newXP
                game.devLevel = newLevel

                devDocRef
                    .update(game)
                    .catch((err) => {
                        return response.status(500).json({error: "Problem updating xp and level"})
                    })
            })
            .then(() => {
                return response.status(200).json({message: "Success!"})
            })
            .catch((err) => {
                return response.status(502).json({error: err.message})
            })
    }) // end loop
}


exports.updateProjectCommits = (request, response) => {
    // TODO: find project by the repo id stored in the project document and add the commits to it
}