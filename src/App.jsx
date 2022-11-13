import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import {ToastContainer} from "react-toastify";
import AuthContext from "./context/AuthProvider";
import {useContext} from "react";


function App() {
    const {auth}  = useContext(AuthContext)

  return (
    <>
    <div className="wrap">
     <Header/>
     <div className="container">
         {auth.token ? <Dashboard/> : <Login/>}
     </div>
    </div>
        <ToastContainer />
    </>
  );
}

export default App;
