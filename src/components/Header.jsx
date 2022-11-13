import AuthContext from "../context/AuthProvider";
import {useContext} from "react";
import {toast} from "react-toastify";

function Header() {
    const {auth,setAuth}  = useContext(AuthContext)
    const logout = (e) => {
        e.preventDefault();
        setAuth({})
        localStorage.removeItem("apiKeyValue")
        localStorage.removeItem("tokenValue")
        toast.info('You signed out!')
    }
    return (
        <div className="header">
            <div className="logo">PSP APP</div>
            {auth.token && <div className="logout" onClick={logout}>Sign out</div>}
        </div>
    )
}

export default Header;