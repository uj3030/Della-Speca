import { useEffect, useState } from "react"
import { Link,useNavigate,useSearchParams  } from "react-router-dom"
import { toast } from "react-toastify"

const  ResetPassword = () => {
    const [username, setusername] = useState()
    const [pass, setpass] = useState()
    const [cpass, setcpass] = useState()
    const [flag, setflag] = useState()
    const [error, seterror] = useState({})
    const[params]=useSearchParams()
    const token = params.get("token")
    const navigate = useNavigate()

    useEffect(()=>
    {
        chkresetlinktym()
    },[])

    const chkresetlinktym=async()=>
    {
        try {
            const res = await fetch(`http://localhost:9000/api/chklinkvalidate?token=${token}`)
            if (res.ok) 
            {
                const result = await res.json();
                if(result.statuscode===1)
                {
                    setusername(result.username)
                    setflag(true)
                }
                else
                {
                     toast.info(result.msg)
                     setflag(false)
                }
               
            }
        }
        catch (error) {
            toast.error(error)
        }
    }

    const validation=()=>
	{
		var errors={}
		 
        if(!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(pass))
		{
			errors.pass ="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
		}

		seterror(errors)
		return Object.keys(errors).length !==0?false:true
	}
    const submit = async () => {
        if(validation()===true)
        {
            if(pass===cpass)
            {
                try {
                    const apiresp = await fetch(`http://localhost:9000/api/resetpassword?un=${username}&pass=${pass}`,
                    {
                        method:"put",
                        headers:
                        {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    })
                    if (apiresp.ok) 
                    {
                        const result = await apiresp.json();
                        toast.info(result.msg)
                        navigate("/login")
                    }
                }
                catch (error) {
                    toast.error(error)
                }
            }
            else
            {
                toast.error("password and confrim password not match")
            }
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><a href="index.html"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li>
                        <li className="active">Reset Password</li>
                    </ol>
                </div>
            </div>
                   {
                 flag? 
           <div className="register">
                <div className="container">
             
                    <h2>Reset Password</h2>
                    <div className="login-form-grids">                         
                        <input type="password" name="pass" placeholder="New Password"   onChange={(e) => setpass(e.target.value)} />
                        {error.pass ? <span>{error.pass}</span> : null}  <br />
                        <input type="password" name="cpass" placeholder="Confrim Password"   onChange={(e) => setcpass(e.target.value)} />
                        {error.pass ? <span>{error.pass}</span> : null}  <br />
                        <button className="btn btn-primary" onClick={submit}>Submit</button>
                    </div>
                    <div className="register-home">
                        <Link to="/homepage">Home </Link>
                    </div>
                </div>
            </div>:
            <div className="register">
            <div className="container">
            <h2>Reset link is expired,It was valid 15mins only.Request new link.</h2>
            </div>
            </div>
            }
        </>
    )
}
export default  ResetPassword