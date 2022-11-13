import {BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom";
import Report from "./partials/Report";
import Transactions from "./partials/Transactions";
import Client from "./partials/Client";
import TransactionItem from "./partials/TransactionItem";

function Dashboard() {



    return (
        <Router>
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="menu">
                <NavLink to="/" className="menu-item" activeclassname="active" id="report">Report</NavLink>
                <NavLink to="/transactions" className="menu-item" activeclassname="active" id="transaction">Transactions</NavLink>
                <NavLink to="/client" className="menu-item" activeclassname="active" id="client">Client</NavLink>
            </div>
            <div className="page">

                <Routes>
                    <Route path="/" element={<Report/>}/>
                    <Route path="/transactions" element={<Transactions/>}/>
                    <Route path="/client" element={<Client/>}/>
                    <Route path="/transaction/:transactionId" element={<TransactionItem/>}/>
                </Routes>

            </div>

        </div>
        </Router>
    )
}

export default Dashboard;