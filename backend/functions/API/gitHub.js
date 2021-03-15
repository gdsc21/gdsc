const { admin, fs, firebase, FieldValue} = require('../util/admin');
const { createAppAuth } = require('@octokit/auth-app');

let clientID = "Iv1.1d26e7ddd2fe7a0d"
let clientSecret = "9bf11c9de8c262124789ad100474c6ae018cbb1c"
let privateKey = "MIIEowIBAAKCAQEAvnpk9KkE6YyZXGhbQHeCP+GJNNuAcg3HF4JnfX9D46NnORSL\n" +
    "ZBk8lHCs2XmTtqTY2A1BuVJj6Al0zivvLZEOEGq6bCJPEACB17AFZ0c4njrpzzT1\n" +
    "LC4LMz94YJfkVCc0LEfiWOYX1ViAekHUfIrB2bhSfQ8lt6/9fT0nBGm6wC+ssLxS\n" +
    "G9yHOYB3p3M+mkh29M0QzGgxakoVWLCw434rLfLAo0qnw7cd6qwOhZffeOu8RyLg\n" +
    "bxXUrwbU574R+/7r+heHrN+/xW+gzwboXr/GCvvwFbZRTKIxp5RjkyAkMY2i27H9\n" +
    "wy1N2o6rKrO//8h/eehgBLrpAJ9H28c1EY0sVQIDAQABAoIBAC07jXvYI1V+0PBz\n" +
    "y6+scZ7P5TBLK95pzSyVCBRyQ2HsbNfOPCfCInOxqipex6goz2HHDCOBID56+GT5\n" +
    "Y+vzNV7KqYiCQTowlKTupOnYrOZOYTWWgt5B9ODvopt1loAxax9U1rh7s48zXBcs\n" +
    "SNRmcxBLyDLwhOlw/oZeHkTbAsEeaCo3xtG4sueVA6vYAO2yCyE9IpPaQAdr1dm5\n" +
    "8lZLpQ17Fx/lcPkmREHn/iOzkNhQu/G6VrSCv0Rsm6KgDnvmAwrlYzZc1ddMUT79\n" +
    "vm0J+7GJwbbmJ+OplxNuZ9Kv3LxINyWBEKH/hWoXcJ48A0oq7fLEXOc8/6zWaLYC\n" +
    "X2kg+WECgYEA53zk8fZaVZTT4AWRSc0BzL6agb36/p7qD/m8zpKVnKU3qpqEku3V\n" +
    "UCeI2tkPmu2U0Wt13emtFYI5Q8osskHs+yaoKU9UKjBZG97wpr0mELZ3fZLPYwng\n" +
    "DZudJlS1cVbO+75PKF5Iyyaai1Bm6GPER5iBQC298yEKhNv6x/JW6HkCgYEA0qXR\n" +
    "u5zbH/Sm4VgH4CWCqINGQGmfyCjCg8Y5etidfjbge1RACdZv99YugHKeh/SSirAl\n" +
    "eii+NFLrApQn3dPjJL3H3SkWdk9jyfyfF0td2pREcGUhiv4O7iiYlgCnq01IJSuP\n" +
    "1iZVYPBfyihKz3KX9ralY+nXMcBb521uekGzI70CgYAZgXxkYKWBan2R4Gsqu4jo\n" +
    "O1Qg2YLvTSkzC2xPQn1zngytIota+ROY2lJM8r+ybV0JWhLJmba1ePzASGV2Wqc2\n" +
    "4QKEUrZOU7dtx7myVYL9Mm2mC2gIXI0wUqYVFB5N16fEuypTo1fX8m/yy7AbCOsW\n" +
    "jGopXSDhyhEzpF1UbJJA2QKBgQCyBuqGwT6Ad2hCsv+U9J7EhI3vClW7+JbMf888\n" +
    "f647aW23TbEBn3Xp495ROI27IXxoMg66e4yk9B8igsxesiEagDpWM8+EFfykTRi3\n" +
    "uz6K6RweUZpTufwsU6sBu3P5VstOfs6Fksg9sWmDlSIEyTidjiehlZQFvCjwIpBo\n" +
    "SvZ3kQKBgBl4EAAO22GvADuqvlx4uteV5gA/korKOi5X9OkY8Ujg8D45FTuweji0\n" +
    "CpLhOCNfGO4YjqlLWgawh3rRTrIqC1q7kUIlmFkUTJVAS/Hv7xC2j9ffLepKSJ+/\n" +
    "j+hG3zzuZkYlKBdWgVlExsCTKsnpp5+1VXkIq0tiSuWEWFVaGbQO"

// creates a JWT token
async function createJWT(installation_id) {
    const auth = createAppAuth({
        appId: 105035,
        privateKey: privateKey,
        installationId: installation_id,
        clientId: "Iv1.1d26e7ddd2fe7a0d",
        clientSecret: "9bf11c9de8c262124789ad100474c6ae018cbb1c"
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

exports.updateDevCommits = (request, response, next) => {

    let summaries = request.body.commitSummaries
    let authorEmail, authorUid

    let batch = fs.batch()

    let devAccRef = fs.collection("commits")
    let devAccDocRef

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

        devAccDocRef = devAccRef.doc(authorUid)

        // creates the commit document if it doesn't exist otherwise it appends the commit to the document
        batch.set(devAccDocRef, {
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
        },  { merge: true }
        )
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