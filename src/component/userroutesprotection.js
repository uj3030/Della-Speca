import { useContext, useEffect } from "react"
// import usercontext from "./usercontext"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"

const UserRoutesProtection=(props)=>
{
    const {LoggedIn}=useSelector((state)=>
    {
        return state.userslice
    })
    // const{user}=useContext(usercontext)
    const navigate=useNavigate()

    useEffect(()=>
    {
            if(!LoggedIn)
            {
                navigate("/login")
            }
    },[])
   
    return(
        <>
            <props.mycomp/>
        </>
    )
}
export default UserRoutesProtection