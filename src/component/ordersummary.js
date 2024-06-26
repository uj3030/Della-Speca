import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
// import usercontext from "./usercontext"
const Ordersummarry=()=>
{
    // const{user}=useContext(usercontext)
    const[orderno,setorderno]=useState({})
    const {username}=useSelector((state)=>
	{
		return state.userslice
	})
    useEffect(()=>
    {
        fetchorderno()
    },[])
    const fetchorderno=async()=>
    {
        try
        {
            const res = await fetch(`http://localhost:9000/api/fetchorderno/${username}`)
            if(res.ok)
            {
              const result = await  res.json()
              if(result.statuscode===1)
              {
                 setorderno(result.orderdata)
              }
              else if(result.statuscode===0)
              {
                toast.error("error")
              }
            }
        }
        catch(error)
        {
            toast.error(error)
        }
    }
    return(
    <>
    <div className="container">
                <div className="login">
                    <h3 align="center">THANKS FOR SHOPPING OUR WEBSITE. YOUR ORDER NO IS {orderno._id}</h3>
                </div>
             </div>
    </>
    )
}
export default Ordersummarry