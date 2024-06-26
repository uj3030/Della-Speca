import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../Reducer/userslice";
import { toast } from "react-toastify"

const Changepassword = () => {
    const dispatch=useDispatch()
    const [pass, setpass] = useState()
    const [newpass, setnewpass] = useState()
    const [confrimpass, setconfrimpass] = useState()
    // const [msg, setmsg] = useState()
    const navigate = useNavigate()

    const {username}=useSelector((state)=>
    {
        return state.userslice
    })
    const onchangepassword = async () => {
        if (newpass === confrimpass)
        {
            if(newpass!==pass)
            {
                try {
                    const value = { uname:username, pass, newpass }
                    const res = await fetch("http://localhost:9000/api/changepassword",
                        {
                            method: "put",
                            body: JSON.stringify(value),
                            headers:
                            {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        })
                    if (res.ok) {
                        const result = await res.json()
                        if (result.statuscode === 1) {
                            toast.success(result.msg)
		                    dispatch(logout())
		                    sessionStorage.clear()
                            navigate("/login")
                        }
                        else if (result.statuscode === 0) {
                            toast.error(result.msg)
                        }
                        else if (result.statuscode === -1) {
                            toast.error(result.msg)
                        }
                        else if (result.statuscode === -2) {
                            toast.error(result.msg)
                        }
                    }
                }
                catch (err) {
                    toast.error(err)
                }
            }
            else
            {
                toast.error("Please choose different new password")
            }
            
        }
        else {
            toast.error("New password and confrim password do not match,try again")
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Change Password</li>
                    </ol>
                </div>
            </div>

            <div className="login">
                <div className="container">
                    <h2>Change Password</h2>

                    <div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
                        <form>

                            <input type="password" placeholder="oldPassword" name="pass" onChange={(e) => setpass(e.target.value)} />

                            <input type="password" placeholder="newPassword" name="pass" onChange={(e) => setnewpass(e.target.value)} />

                            <input type="password" placeholder="confrimPassword" name="pass" onChange={(e) => setconfrimpass(e.target.value)} />

                            <input type="button" className="btn btn-primary" onClick={onchangepassword} value="Change password" />
                        </form><br />
                        
                    </div>

                    <p> go back to <Link to="/homepage">Home<span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span></Link></p>
                </div>
            </div>
        </>
    )
}
export default Changepassword