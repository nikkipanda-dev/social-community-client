import { useState, useEffect, } from "react";
import { createContext, } from "react"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [firebase, setFirebase] = useState();

    const handleFirebase = firebase => setFirebase(firebase);

    return (
        <AuthContext.Provider>
            
        </AuthContext.Provider>
    )
}
