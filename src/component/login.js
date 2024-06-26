import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux"
import { login } from "../Reducer/userslice"

const Login = () => {
	const [uname, setuname] = useState()
	const [pass, setpass] = useState()
	const [cverification, setcverification] = useState(false)
	const navigate = useNavigate()
	const [params] = useSearchParams()
	const productid = params.get("pid")
	const tokenid = params.get("token")
	const [error, seterror] = useState({})

	const dispatch = useDispatch()

	const onChange = (value) => {
		if (value) {
			setcverification(true)
		}
		else {
			setcverification(false)
		}
	}
	const validation = () => {
		var errors = {}
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(uname)) {
			errors.email = "invalid email"
		}
		seterror(errors)
		return Object.keys(error).length !== 0 ? false : true
	}

	useEffect(() => {
		if (tokenid) {
			activeacc()
		}
	}, [tokenid])

	const activeacc = async () => {
		try {
			const res = await fetch(`${process.env.REACT_APP_APIURL}activeacc/${tokenid}`)
			if (res.ok) {
				const result = await res.json()
				if (result.statuscode === 1) {
					toast.success("Your account activate successfully")
				}
				else {
					toast.error("Account not activate, try again")
				}
			}
		}
		catch (error) {
			toast.error(error)
		}
	}

	const chk = async () => {
		if (cverification === true) {
			if (validation() == true) {
				const value = { uname, pass }
				try {
					const res = await fetch(`${process.env.REACT_APP_APIURL}login`,
						{
							method: "post",
							body: JSON.stringify(value),
							headers:
							{
								'Content-type': 'application/json; charset=UTF-8',
							}
						})
					if (res.ok) {
						const result = await res.json()
						if (result.statuscode === 1) {
							if (productid) {
								navigate({
									pathname: '/productdetail',
									search: `?productid=${productid}`,
								});
								dispatch(login(result.memberdata))
								sessionStorage.setItem("userinfo", JSON.stringify(result.memberdata))
								sessionStorage.setItem("token", JSON.stringify(result.authtoken))
							}
							else if (result.memberdata.usertype === "admin") {
								navigate("/adminhomepage")
								dispatch(login(result.memberdata))
								sessionStorage.setItem("userinfo", JSON.stringify(result.memberdata))
								sessionStorage.setItem("token", JSON.stringify(result.authtoken))
							}
							else {
								dispatch(login(result.memberdata))
								sessionStorage.setItem("token", JSON.stringify(result.authtoken))
								sessionStorage.setItem("userinfo", JSON.stringify(result.memberdata))
								navigate("/homepage")
							}
						}
						else {
							toast.error("invalid uname or password")
						}
					}
				}
				catch (error) {
					toast.error(error)
				}
			}
		}
	}

	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Login Page</li>
					</ol>
				</div>
			</div>

			<div className="login">
				<div className="container">
					<h2>Login Form</h2>

					<div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
						<form>
							<input type="email" placeholder="Email Address" name="uname" required=" " onChange={(e) => setuname(e.target.value)} /><br />
							{error.email ? <span>{error.email}</span> : null}
							<input type="password" placeholder="Password" name="pass" required=" " onChange={(e) => setpass(e.target.value)} />
							<div className="forgot">
								<Link to="/forgotpassword">Forgot Password?</Link>

							</div><br />
							<ReCAPTCHA sitekey="6LfjA5ImAAAAAItnAwNJjuHtcKdDXxV0BFWDK41C" onChange={onChange} /><br />
							<input type="button" className="btn btn-primary" onClick={chk} value="Login" />
						</form>

					</div>
				</div>
			</div>
		</>
	)
}
export default Login