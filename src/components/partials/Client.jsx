import {useContext, useState} from "react";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "../Spinner";

const apiRoot = process.env.REACT_APP_API_ROOT;

function Client() {
    const {auth, setAuth} = useContext(AuthContext)
    const [client, setClient] = useState()
    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState('')

    const searchClient = async (e) => {
        e.preventDefault()
        setLoading(true)
        const url = `${apiRoot}/client`
        try{
            const {apiKey,token} = auth;
            const [res] = await Promise.all([axios.post(url, {transactionId,apiKey},
                {
                    headers: {'Accept': "application/json", Authorization: `Bearer ${token}`},
                })])
            if(res.status === 200){
                setClient(res.data.clientInfo)
            }

        }catch (err){
            if(!err.response){
                toast.error('No server response')
            }else if(err.response.status === 400){
                toast.error(err.response.data.message)
            }else if(err.response.status === 401){
                setAuth({})
                localStorage.removeItem("apiKeyValue")
                localStorage.removeItem("tokenValue")
                toast.error('Session expired!')
            }else{
                toast.error('Something wrong, make sure the transaction id is correct')
            }
        }
        setLoading(false)
    }

    return (
        <div className="report" style={{textAlign:"center"}}>
            <div className="report-dates" style={{gridTemplateColumns:"2fr 1fr"}}>
                <input
                    type="text"
                    style={{width:"90%", fontSize:"20px"}}
                    placeholder="Enter transaction ID..."
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                />
                <button style={{height:"50px"}} onClick={searchClient}>Find Client via Transaction ID</button>
            </div>
            <div style={{marginTop:"40px"}}>
                {loading ? <Spinner/> : (client && (
                    <div style={{width:"80%",position:"relative", right:0, left:0, margin:"auto", background:'#205375', borderRadius:"40px", padding:"20px"}}>
                        <h1>Client Details</h1>
                        <div><strong>Name:</strong> {client.name}</div>
                        <div><strong>E-mail:</strong> {client.email}</div>
                        <div style={{textAlign:"center"}}><strong>Billing Address:</strong><br/>{client.billing_address}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Client;