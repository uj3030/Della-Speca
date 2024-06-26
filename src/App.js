import Header from "./component/header";
import Footer from "./component/footer";
import Siteroute from "./component/siteroutes";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import usercontext from "./component/usercontext";
import { useEffect, useState } from "react";
import Adminheader from "./component/adminheader";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./Reducer/userslice";
function App() {
  // const[user,setuser]=useState()
  const[utype,setutype]=useState()

 const {LoggedIn,usertype}= useSelector((state)=>
  {
    return state.userslice
  })
  const dispatch=useDispatch()

  useEffect(()=>
  {
    if(sessionStorage.getItem("userinfo")!==null)
    {
      const userdata=(JSON.parse(sessionStorage.getItem("userinfo")))
      dispatch(login(userdata))
    }
  },[])

  useEffect(()=>
  {
    if(LoggedIn)
    {
      if(usertype==="admin")
      {
        setutype("admin")
      }
      else  
      {
        setutype("normal")
      }
    }
    else
    {
      setutype("normal")
    }
  },[LoggedIn])
  return (
    <>
    {/* <usercontext.Provider value={{user,setuser}}> */}
    <ToastContainer theme="colored"/>
    {
      utype==="admin"?<Adminheader/>: <Header/>
    }
    <Siteroute/>
    <Footer/>
    {/* </usercontext.Provider> */}
    </>
  );
}

export default App;
