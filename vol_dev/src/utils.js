import {fbApp} from "./firebase";

export const setStorageSessionExpire = (key, value, ttl) => {
    // ttl must be in seconds since now.getTime() is epoch time
    const now = new Date()

    const item = {
        value: value,
        expiry: now.getTime() + ttl
    }
    try {
        sessionStorage.setItem(key, JSON.stringify(item))
    } catch {
        console.warn("Failed to save", key, "to session storage")
        return null
    }
}

export const getSessionStorageExpire = (key) => {
    let item
    try {
        item = sessionStorage.getItem(key)
    } catch {
        console.warn("Failed to load", key, "from session storage")
        return null
    }
    if (!item) {
        console.warn(key, "is not in session storage")
        return null
    }

    let now = new Date()
    let data = JSON.parse(item)

    if (now.getTime() > data.expiry) {
        console.warn(key, "has expired in session storage")
        return null
    }

    return data.value
}

export const getSessionStorage = (key) => {
    let item
    try {
        item = sessionStorage.getItem(key)
    } catch {
        console.warn("Failed to load", key, "from session storage")
        return null
    }
    if (!item) {
        console.warn(key, "is not in session storage")
        return null
    }

    return JSON.parse(item)
}

export const removeSessionStorage = (key) => {
    try {
        sessionStorage.removeItem(key)
    } catch {
        console.warn("Failed to remove", key, "from session storage")
        return null
    }
    return true
}

export const authErrorCheck = (err) => {
    // takes err an axios error object
    if (err.response.status === 403) {
        fbApp
            .auth()
            .signOut()
            .then(() => {
                removeSessionStorage("token");
                // TODO: The below redirect doesn't load the react component just the cached html + css
                window.location.href = "/signin";
            })
            .catch((err) => {
                console.warn("Error signing out", err.message)
            })
    } else {
        console.warn("Request Error:", err.response.data)
    }
}

export const signOut = () => {
    fbApp
        .auth()
        .signOut()
        .then(() => {
            removeSessionStorage("token");
            removeSessionStorage("context")
            removeSessionStorage("isDev")
        });
}
