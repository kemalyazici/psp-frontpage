import {createContext, useState} from "react";

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState({
        apiKey: localStorage.getItem('apiKeyValue'),
        token:localStorage.getItem('tokenValue'),
    })

    return <AuthContext.Provider value={{auth, setAuth}}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext