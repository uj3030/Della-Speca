import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
const Searchuser=()=>
{
    const[uname,setuname]=useState()
    // const[msg,setmsg]=useState()
    const[udata,setudata]=useState({})
    const[flag,setflag]=useState(false)

    const search=async()=>
    {
      const res= await fetch(`http://localhost:9000/api/searchuser?un=${uname}`)
      if(res.ok)
      {
        const result=await res.json()
        if(result.statuscode===0)
        {
            toast.error("user not found invalid email address")
            setflag(false)
            setudata({})
        }
        else
        {
            setudata(result.mdata)
            setflag(true)
         
        }
      }
    }
    return(
        <>
          <div className="breadcrumbs">
		<div className="container">
 			<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
 				<li><Link to="/adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
 				<li className="active">Search User</li>
 			</ol>
 		</div>
 	</div>
 
 	<div className="login">
 		<div className="container">
 			<h2>Enter Username</h2>
		
 			<div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
 				<form name="form1">
 					<input type="email" name="uname" placeholder="Email Address(username)" required=" " onChange={(e)=>setuname(e.target.value)}/><br/>
				<input type="button" className="btn btn-primary" onClick={search} name="btn" value="Submit"/><br/><br/>
 				</form>
                  {
                    flag?
                    <div>
                    <b>Name:-</b>{udata.pname}<br/>
                    <b>Phone:-</b>{udata.phone}<br/>
                    <b>Username:-</b>{udata.username}
                    </div>:null
                  }
                 
 			</div>
 		</div>
 	</div>
        </>
    )
}
export default Searchuser