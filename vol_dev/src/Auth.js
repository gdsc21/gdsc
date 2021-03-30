import React, { useEffect, useState } from 'react'
import { loadContext } from "./store";
import {fbApp} from './firebase'

export const AuthContext  = React.createContext(null);

export function AuthProvider({ children }) {
    const  [currentUser, setCurrentUser] = useState(null);


    useEffect(() => {
        fbApp.auth().onAuthStateChanged(setCurrentUser);
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}