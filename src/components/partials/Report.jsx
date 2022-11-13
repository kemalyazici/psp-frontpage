import AuthContext from "../../context/AuthProvider";
import {useContext, useState} from "react";
import {toast} from "react-toastify";
import Spinner from "../Spinner";
import axios from "axios";
import Flag from 'react-world-flags'
const apiRoot = process.env.REACT_APP_API_ROOT;


function Report() {
    const {auth, setAuth} = useContext(AuthContext)
    const [fromDate, setFromDate] = useState("0000-00-00")
    const [toDate, setToDate] = useState("0000-00-00")
    const [loading, setLoading] = useState(false)
    const [data,setData] = useState([])


    const onReport = async (e) => {
        e.preventDefault();
        setLoading(true)
        const url = `${apiRoot}/transactions/report`
        if(fromDate === "0000-00-00" || toDate === "0000-00-00") {
            toast.warning('Date field is empty')
        }else{
            try{
                const {apiKey,token} = auth;
                const [res] = await Promise.all([axios.post(url, {fromDate,toDate,apiKey},
                    {
                        headers: {'Accept': "application/json", Authorization: `Bearer ${token}`},
                    })])
                if(res.data.status==="APPROVED"){
                    setData(res.data.response)
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
                    toast.error('Something wrong')
                }
            }
        }
        setLoading(false)
    }

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

    const countryOpFlag = (curr) => {
        if(curr==="TRY"){
            return 'tr'
        }else if(curr==="EUR"){
            return 'EU'
        }else if(curr==="USD"){
            return 'us'
        }
        else{
            return 'gb'
        }
    }


    return (
        <div className="report">
            <div className="report-dates">
                <div><label>From:</label> <input type="date" value={fromDate} required onChange={e => setFromDate(e.target.value)}/></div>
                <div><label>To:</label> <input type="date" value={toDate} required onChange={e => setToDate(e.target.value)}/></div>
                <div><button onClick={onReport}>Report</button></div>
            </div>
            <div style={{textAlign:"center", width:"100%"}}>
                {loading ? <Spinner/> : (
                    <div style={{margin:"80px 0", display:"grid", gap:"20px", gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
                        {
                            data.length>0 && data.map((item) => (
                                <div className="report-item" key={item.currency}>
                                    <div>{item.count} transactions</div>
                                    <div>Total: {`${countryOpCurr(item.currency)}${item.total}`}</div>
                                    <div><Flag code={countryOpFlag(item.currency)} style={{width:"85px"}}/></div>
                                </div>
                            ))
                        }

                </div>)}
            </div>
        </div>
    )
}

export default Report;