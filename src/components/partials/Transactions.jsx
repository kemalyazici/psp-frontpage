import {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthProvider";
import {toast} from "react-toastify";
import axios from "axios";
import Spinner from "../Spinner";
import {Link} from "react-router-dom";
import Pagination from "../Pagination";

const apiRoot = process.env.REACT_APP_API_ROOT;

function Transactions() {
    const {auth, setAuth} = useContext(AuthContext)
    const [page,setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const [data,setData] = useState({
        apiKey: auth.apiKey,
        fromDate:"0000-00-00" ,
        toDate: "0000-00-00",
        currency:"",
        operation:"",
        paymentMethod:"",
        status:""
    })
    const [response, setResponse] = useState([])


    const onTrans = async (data,page) => {
        const url = `${apiRoot}/transactions/list?page=${page}`
        try{
            const {token} = auth;
            const [res] = await Promise.all([axios.post(url, data,
                {
                    headers: {'Accept': "application/json", Authorization: `Bearer ${token}`},
                })])
            if(res.status===200){
                setResponse(res.data.data)
                setLastPage(res.data.last_page);
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

    useEffect(() => {
        toast.info('Date range must be filled')
    }, []);


    useEffect(() => {
        const {fromDate,toDate} = data
        if(fromDate !== "0000-00-00" && toDate !== "0000-00-00") {
            setLoading(true)

            onTrans(data,page)
            setLoading(false)
        }
    // eslint-disable-next-line
    }, [page,data]);


    const onChange = (e) => {
        setData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
        setPage(1)
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

    return (
        <div className="report">
            <div className="report-dates" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
                <div><label>From:</label> <input type="date" value={data.fromDate} required onChange={onChange} id="fromDate"/></div>
                <div><label>To:</label> <input type="date" value={data.toDate} required onChange={onChange} id="toDate"/></div>
                <div><label>Currency:</label> <select value={data.currency} onChange={onChange} id="currency">
                    <option value="">All</option>
                    <option value="GBP">Pound Sterling</option>
                    <option value="EUR">Euro</option>
                    <option value="USD">United States Dollar</option>
                    <option value="TRY">Turkish Lira</option>
                </select></div>
            </div>
            <div className="report-dates" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
                <div><label>Status:</label> <select onChange={onChange} value={data.status} id="status">
                    <option value="">All</option>
                    <option value="APPROVED">Approved</option>
                    <option value="WAITING">Waiting</option>
                    <option value="DECLINED">Declined</option>
                    <option value="ERROR">Error</option>
                </select></div>
                <div><label>Operation:</label> <select onChange={onChange} value={data.operation} id="operation">
                    <option value="">All</option>
                    <option value="DIRECT">Direct</option>
                    <option value="REFUND">Refund</option>
                    <option value="3D">3D</option>
                    <option value="3DAUTH">3DAuth</option>
                    <option value="STORED">Stored</option>
                </select></div>
                <div><label>Payment:</label> <select onChange={onChange} value={data.paymentMethod} id="paymentMethod">
                    <option value="">All</option>
                    <option value="CREDITCARD">Credit card</option>
                    <option value="CUP">CUP</option>
                    <option value="GIROPAY">GiroPay</option>
                    <option value="MISTERCASH">Mistercash</option>
                    <option value="STORED">Stored</option>
                    <option value="PAYTOCARD">Pay to card</option>
                    <option value="CEPBANK">Cepbank</option>
                    <option value="CITADEL">Citadel</option>
                </select></div>
                <div></div>
            </div>
            <div style={{textAlign:"center", width:"100%"}}>
                {loading ? <Spinner/> : response.length>0 && (
                    <div style={{margin:"80px 0"}}>
                        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", background:'#F66B0E', color:'#EFEFEF', padding:"20px"}}>
                            <div>
                                Transaction ID
                            </div>
                            <div>
                                Status
                            </div>
                            <div>
                                Operation
                            </div>
                            <div>
                                Amount
                            </div>
                            <div>
                                Payment Method
                            </div>
                        </div>
                        {
                            response.map((item,k)=>(
                                <Link to={`/transaction/${item.transactionId}`} style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", background:(k%2===0) ? '#112B3C' : '#205375', color:'#EFEFEF', padding:"20px"}} key={item.transactionId}>
                                    <div>
                                        {item.transactionId}
                                    </div>
                                    <div>
                                        {item.status}
                                    </div>
                                    <div>
                                        {item.operation}
                                    </div>
                                    <div>
                                        {`${countryOpCurr(item.currency)}${item.amount}`}
                                    </div>
                                    <div>
                                        {item.paymentMethod}
                                    </div>
                                </Link>
                            ))

                        }

                    </div>)}
            </div>
            <Pagination page={page} setPage={setPage} totalPage={lastPage}/>
        </div>
    )
}

export default Transactions;