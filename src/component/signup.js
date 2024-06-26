import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import ReCAPTCHA from "react-google-recaptcha";
const Signup = () => {
	const [pname, setpname] = useState("")
	const [phone, setphone] = useState()
	const [username, setusername] = useState("")
	const [pass, setpass] = useState()
	const [cpass, setcpass] = useState()
	const [cverification, setcverification] = useState(false)
	const [error, seterror] = useState({})

	const onChange = (value) => {
		if (value) {
			setcverification(true)
		}
		else {
			setcverification(false)
		}
	}

	const validation = () => 
	{
		const errors = {};
		if (pname.length < 3) {
			errors.name = 'Name must be at least 3 characters long';
		}

		if (!/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(phone)) {
			errors.phone = 'Phone must be a 10-digit number';
		}

		if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
			errors.email = 'Invalid email format';
		}

		if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/.test(pass,cpass)) {
			errors.password =
				'Password must contain at least 1 uppercase, 1 number, 1 special character, and be at least 6 characters long';
		}
		if(pass!==cpass)
		{
			errors.pass="Password and confrim Password are not match"
			// toast.error("Password and confrim Password are not match")
		}
		seterror(errors);
		// console.log(Object.keys(error).length,'-=-=-=-');
		return Object.keys(errors).length > 0 ? false:true;
		// return Object.keys(error).length !== 0 ? false:true;
	};

	const onclick = () => {
		// seterror("")
		if(validation()===true)
		{
		submit()
		}
		else
		{
			toast.error("Validation errors")
		}
	}
	const submit = async () => {
		const signupdata = { pname, phone, username, pass, usertype: "normal" }
		if (cverification === true) {
		 
					try {
						const apiresp = await fetch("http://localhost:9000/api/register",
							{
								method: "post",
								body: JSON.stringify(signupdata),
								headers:
								{
									'Content-type': 'application/json; charset=UTF-8',
								}
							})
						if (apiresp.ok) {
							const result = await apiresp.json();
							toast.info(result.msg)
						}
					}
					catch (error) {
						toast.error(error)
					} 
			}
			else {
				toast.error("validation error")
			}
		}
	 
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Register Page</li>
					</ol>
				</div>
			</div>
			<div className="register">
				<div className="container">
					<h2>Register Here</h2>
					<div className="login-form-grids">
						<h5>profile information</h5>

						<input type="text" placeholder=" Name" required=" " onChange={(e) => setpname(e.target.value)} />
						{error.name ? <span>{error.name}</span> : null}

						<input type="text" placeholder="Phone no." required=" " onChange={(e) => setphone(e.target.value)} />
						{error.phone ? <span>{error.phone}</span> : null}

						<h6>Login information</h6>

						<input type="email" name="username" placeholder="Email Address(username)" required=" " onChange={(e) => setusername(e.target.value)} />
						{error.email ? <span>{error.email}</span> : null}

						<input type="password" name="pass" placeholder="Password" required=" " onChange={(e) => setpass(e.target.value)} />
						{error.password ? <span>{error.password}</span> : null}

						<input type="password" name="cpass" placeholder="Password Confirmation" required=" " onChange={(e) => setcpass(e.target.value)} />
						{error.pass ? <span>{error.pass}</span> : null}

						<div className="register-check-box">
							<div className="check">
								<label className="checkbox"><input type="checkbox" name="checkbox" /><i> </i>I accept the terms and conditions</label>
							</div>
						</div><br />
						<ReCAPTCHA sitekey="6LfjA5ImAAAAAItnAwNJjuHtcKdDXxV0BFWDK41C" onChange={onChange} /><br />
						<button className="btn btn-primary" onClick={onclick}>Submit</button>

					</div>
					<div className="register-home">
						<Link to="/homepage">Home </Link>
					</div>
				</div>
			</div>
		</>
	)
}
export default Signup