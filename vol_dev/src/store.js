import React from "react";

export const userData = null

export const userDataReducer = (state, action) => {
    switch (action.type) {
        case "set":
            saveContext(action.payload)
            return action.payload
        case "reset":
            saveContext(null)
            return null
        default:
            saveContext(null)
            return null
    }
}

// loads context from session storage
export const loadContext = () => {
    try {
        const serializedState = sessionStorage.getItem('context');
        if(serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
};

// saves context to session storage -- should be used everytime the context changes/is updated
const saveContext = (context) => {
    try {
        const serializedContext = JSON.stringify(context);
        sessionStorage.setItem('context', serializedContext);
    } catch (e) {
        // Ignore write errors;
    }
};


// creates context with a default as the context saved in session storage if available
export const Context = React.createContext()
