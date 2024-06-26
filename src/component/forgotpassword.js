import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const Forgotpassword = () => {
    const [username, setusername] = useState()
    const [error, seterror] = useState({})
    const validation = () => {
        var errors = {}
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)) {
            errors.email = "invalid email"
        }
        seterror(errors)
        return Object.keys(errors).length !== 0 ? false : true
    }
    const submit = async () => {
        if (validation() === true) {
            try {
                const apiresp = await fetch(`http://localhost:9000/api/forgotpassword/${username}`)
                if (apiresp.ok) {
                    const result = await apiresp.json();
                    toast.info(result.msg)
                }
            }
            catch (error) {
                toast.error(error)
            }
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><a href="index.html"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li>
                        <li className="active">Forgot Password</li>
                    </ol>
                </div>
            </div>
            <div className="register">
                <div className="container">
                    <h2>Forgot Password</h2>
                    <div className="login-form-grids">
                        <input type="email" name="username" placeholder="Email Address(username)" required=" " onChange={(e) => setusername(e.target.value)} />
                        {error.email ? <span>{error.email}</span> : null}  <br />
                        <button className="btn btn-primary" onClick={submit}>Submit</button>
                    </div>
                    <div className="register-home">
                        <Link to="/homepage">Home </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Forgotpassword