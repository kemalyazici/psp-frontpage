import {useParams} from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import Spinner from "../Spinner";
const apiRoot = process.env.REACT_APP_API_ROOT;

function TransactionItem() {
    const {auth,setAuth} = useContext(AuthContext)
    const  {transactionId} = useParams()
    const [loading, setLoading] =useState(true)
    const [data,setData] = useState({})

    const getTransactionDetails = async (id) => {
        const url = `${apiRoot}/transactions`
        try{
            const {apiKey,token} = auth;
            const [res] = await Promise.all([axios.post(url, {transactionId:id,apiKey:apiKey},
                {
                    headers: {'Accept': "application/json", Authorization: `Bearer ${token}`},
                })])
            if(res.status === 200){
                setData(res.data)
            }
        }
        catch (err) {
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
                toast.error('Something wrong')
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        getTransactionDetails(transactionId)
        // eslint-disable-next-line
    }, []);

    const countryOpCurr = (curr) => {
        if(curr==="TRY"){
            return '₺'
        }else if(curr==="EUR"){
            return "€"
        }else if(curr==="USD"){
            return "$"
        }
        else{
            return "£"
        }
    }

    const {merchant, client, transaction} = data;

    return loading ? <Spinner/> : (
        <div className="transaction">
            <div>
                <h1>Merchant Details</h1>
                <div><strong>Name:</strong> {merchant.name}</div>
                <div><strong>E-mail:</strong>: {merchant.email}</div>
            </div>
            <div>
                <h1>Client Details</h1>
                <div><strong>Name:</strong> {client.name}</div>
                <div><strong>E-mail:</strong> {client.email}</div>
                <div style={{textAlign:"center"}}><strong>Billing Address:</strong><br/>{client.billing_address}</div>
            </div>
            <div>
                <h1>Transaction Details</h1>
                <div><strong>ID#:</strong> {transactionId}</div>
                <div><strong>Status:</strong> {transaction.status}</div>
                <div><strong>Operation:</strong> {transaction.operation}</div>
                <div><strong>Date:</strong> {transaction.date}</div>
                <div><strong>Payment Method:</strong> {transaction.paymentMethod}</div>
                <div><strong>Amount:</strong> {`${countryOpCurr(transaction.currency)}${transaction.amount}`}</div>
            </div>
        </div>
    )
}

export default TransactionItem;