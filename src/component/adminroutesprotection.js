import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

const AdminRoutesProtection=(props)=>
{
    const{LoggedIn,usertype}=useSelector((state)=>
    {
        return state.userslice
    })
    const navigate=useNavigate()

    useEffect(()=>
    {
            if(!LoggedIn)
            {
                navigate("/login")
            }
            else
            {
                if(usertype!=="admin")
                {
                    navigate("/login")
                }
            }
    },[])
   
    return(
        <>
            <props.mycomp/>
        </>
    )
}
export default AdminRoutesProtection