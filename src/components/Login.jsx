import {useState, useContext} from "react";
import {toast } from 'react-toastify';
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import {BiLoaderCircle} from "react-icons/bi";
const apiRoot = process.env.REACT_APP_API_ROOT;


function Login() {
    const {setAuth} = useContext(AuthContext)
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [loading, setLoading] = useState(false)

     const login = async (e) => {
         e.preventDefault();
         setLoading(true)
         const url = `${apiRoot}/merchant/user/login`;
         if(email.length<2 || password.length<2){
             toast.warning('Please fill the fields correctly!')
         }else{
             try{
                 const [res] = await Promise.all([axios.post(url, {email, password},
                     {
                         headers: {'Accept': "application/json"}
                     })])
                    if(res.data.status==="APPROVED"){
                        const {token,apiKey} = res.data
                        localStorage.setItem("apiKeyValue",res.data.apiKey)
                        localStorage.setItem("tokenValue",res.data.token)
                        setAuth({token, apiKey})
                        toast.success('You signed in!')
                    }
             }catch (err){
                    if(!err.response){
                        toast.error('No server response')
                    }else if(err.response.status === 400){
                        toast.error(err.response.data.message)
                    }else if(err.response.status === 401){
                        toast.error(err.response.data.error)
                    }else{
                        toast.error('Login failed')
                    }
             }
         }
         setLoading(false)
     }

    return (
        <div className="login">
            <div className="form">
                <div className="form-item">
                    <input
                        type="text"
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-item">
                    <input
                        type="password"
                        placeholder="Enter your password..."
                        value={password}
                        required
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <button onClick={login}>{loading ? <BiLoaderCircle className="rotating"/> : 'Sign In'}</button>
                </div>
            </div>
        </div>
    )
}

export default Login;