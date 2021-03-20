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
//
exports.push = async (request, response, next) => {
    let data
    if (typeof request.body != "object")
        data = JSON.parse(request.body)
    else data = request.body

    let commits = data["commits"]

    let appAuth, token

    const auth = createAppAuth({
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
    })

    try {
        // token = await createJWT(data.installation.id)
        appAuth = await auth({type: "installation"})
        token = appAuth.token
    }
    catch(error) {
        console.log({"MainFunc": error})
    }

    if (token === "undefined") return response.status(500).json({error: "The token app token is invalid"})
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


    let url = `https://api.github.com/repos/${commits[0].author.username}/${data.repository.name}/commits/${commits[0].id}`

    fetch(url, reqObj)
        .then((res) => {
            if (res.ok) {
                return response.status(200).json({res: debugRes, body: debugRes.body, json: res.json()})
            }
            else {
                return response.status(201).json({message: res.statusText})
            }
        })
        .catch((err) => {
            return response.status(202).json({error: "rip"})
        })

    //
    //
    // commits.forEach((commit) => {
    //     // creates the unique url for each commit
    //     let url = `https://api.github.com/repos/${commit.author.username}/${data.repository.name}/commits/${commit.id}`
    //     console.log(url)
    //
    //     // get request to each commit url through GitHub Commit API
    //     fetch(url, reqObj)
    //         .then((res) => {
    //             return response.status(200).json({res: debugRes, body: debugRes.body, json: res.json()})
    //         })
    //         .then((res) => {
    //             debugRes = res
    //             console.log(String(debugRes))
    //             console.log(String(debugRes.body))
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
    //                         "additions": debugRes.body.stats.additions,
    //                         "deletions": debugRes.body.stats.deletions,
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

    // // return no commits if no commit summaries was added to commitArr
    // if (commitArr.length === 0) return response.status(400).json({message: "No commits"})
    //
    // // save the newly created summaries to the request body and pass on to the next function
    // request.body = commitArr
    // return response.status(200).json({newData: commitArr})
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