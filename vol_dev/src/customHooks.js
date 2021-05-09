import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {getSessionStorageExpire, signOut} from "./utils";

export const useAxiosPost = (url, postData, protectedRoute) => {
    const cache = useRef({})
    const [status, setStatus] = useState("idle")
    const [data, setData] = useState(null)

    let returnValue = { success: false, data: data}

    useEffect(() => {
        if (!url) {
            returnValue.error = "Url is undefined"
            return
        }
        setStatus("fetching")

        let token, config;
        if (protectedRoute) {
            // get token from session storage --- if it is null/undefined redirect to signin
            token = getSessionStorageExpire("token")
            if (!token) {
                signOut()
                window.location.href = "/signin";
            }
            config = { headers: { Authorization: `Bearer ${token}` } };
        }

        if (cache.current[url]) {
            setData(cache.current[url])
        } else {
            axios
                .post(url, postData, config)
                .then((res) => {
                    setData(res.data)
                    cache.current[url] = res.data

                    // if the request and caching is successful then return resolved promise
                    returnValue.success = true
                    returnValue.data = data

                }).catch((error) => {
                    returnValue.error = error
                    if (error.response) { // server returned http error code (4xx, 5xx)
                        console.warn(error.response)
                        switch (error.response.status) {
                            case 400:
                                break
                            case 401:
                                alert("Please sign in again")
                                signOut()
                                window.location.href = "/signin"
                                break
                            case 403:
                                alert("You are not authorized to access this data")
                                window.location.href = "/404"
                                break
                            case 408:
                                alert("Request timed out. Please check your internet connection and try again")
                                break
                            case 429:
                                alert("You have sent too many requests. Please try again later")
                                break
                            case 500:
                                break
                        }
                    } else if (error.request) { // client received no response from the server or request never left

                    } else { // everything else

                    }
                })
        }
            setStatus("fetched")

    }, [url])

    // returns a promise containing the status of the request and the data whether new or old
    return new Promise((resolve, reject) => {
        if (returnValue.success) resolve({status, data}) // returns the status and new data
        else reject({status, data, error: returnValue.error}) // returns the status, old data, and error value
    })
}

export const useAxiosGet = (url, params, protectedRoute) => {
    const cache = useRef({})
    const [status, setStatus] = useState("idle")
    const [data, setData] = useState(null)

    let returnValue = { success: false, data: data}

    useEffect(() => {
        if (!url) {
            returnValue.error = "Url is undefined"
            return
        }
        setStatus("fetching")

        let token, config;
        if (protectedRoute) {
            // get token from session storage --- if it is null/undefined redirect to signin
            token = getSessionStorageExpire("token")
            if (!token) {
                signOut()
                window.location.href = "/signin";
            }
            config = {
                headers: { Authorization: `Bearer ${token}` },
                params: params
            };
        }

        if (cache.current[url]) {
            setData(cache.current[url])
        } else {
            axios
                .get(url, config)
                .then((res) => {
                    setData(res.data)
                    cache.current[url] = res.data

                    // if the request and caching is successful then return resolved promise
                    returnValue.success = true
                    returnValue.data = data

                }).catch((error) => {
                returnValue.error = error
                if (error.response) { // server returned http error code (4xx, 5xx)
                    console.warn(error.response)
                    switch (error.response.status) {
                        case 400:
                            break
                        case 401:
                            alert("Please sign in again")
                            signOut()
                            window.location.href = "/signin"
                            break
                        case 403:
                            alert("You are not authorized to access this data")
                            window.location.href = "/404"
                            break
                        case 408:
                            alert("Request timed out. Please check your internet connection and try again")
                            break
                        case 429:
                            alert("You have sent too many requests. Please try again later")
                            break
                        case 500:
                            break
                    }
                } else if (error.request) { // client received no response from the server or request never left

                } else { // everything else

                }
            })
        }
        setStatus("fetched")

    }, [url])

    // returns a promise containing the status of the request and the data whether new or old
    return new Promise((resolve, reject) => {
        if (returnValue.success) resolve({status, data}) // returns the status and new data
        else reject({status, data, error: returnValue.error}) // returns the status, old data, and error value
    })
}