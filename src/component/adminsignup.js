import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Adminsignup = () => {
	const [pname, setpname] = useState()
	const [phone, setphone] = useState()
	const [username, setusername] = useState()
	const [pass, setpass] = useState()
	const [cpass, setcpass] = useState()
	const [msg, setmsg] = useState()
	
	// const navigate = useNavigate()
	const submit = async () => {
		setmsg("")
		const signupdata = { pname, phone, username, pass,usertype:"admin" }
		if (pass === cpass) 
		{
			try 
			{
				const apiresp = await fetch("http://localhost:9000/api/register",
					{
						method: "post",
						body: JSON.stringify(signupdata),
						headers:
						{
							'Content-type': 'application/json; charset=UTF-8',
						}
					})
				if (apiresp.ok) 
				{
					const result = await apiresp.json();
					if (result.statuscode === 1)
				    {
						 toast.success("admin created successfully")
					}
					else if (result.statuscode === 0) 
					{
						toast.error(result.msg)
					}
				}
			}
			catch(error)
			{
				toast.error(error)
			}
		}
		else {
			setmsg("password and confrim password are not match")
		}

	}
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Admin Register Page</li>
					</ol>
				</div>
			</div>

			<div className="register">
				<div className="container">
					<h2>Create Admin Account</h2>
					<div className="login-form-grids">
						<h5>profile information</h5>

						<input type="text" placeholder=" Name" required=" " onChange={(e) => setpname(e.target.value)} />
						<input type="text" placeholder="Phone no." required=" " onChange={(e) => setphone(e.target.value)} />

						<h6>Login information</h6>

						<input type="email" name="username" placeholder="Email Address(username)" required=" " onChange={(e) => setusername(e.target.value)} />
						<input type="password" name="pass" placeholder="Password" required=" " onChange={(e) => setpass(e.target.value)} />
						<input type="password" name="cpass" placeholder="Password Confirmation" required=" " onChange={(e) => setcpass(e.target.value)} />
						<div className="register-check-box">
							<div className="check">
								<label className="checkbox"><input type="checkbox" name="checkbox" /><i> </i>I accept the terms and conditions</label>
							</div>
						</div><br/>
						<button className="btn btn-primary" onClick={submit}>Submit</button>

					</div>
					<div className="register-home">
						<Link to="/adminhomepage">Home </Link>
					</div>
				</div>
			</div>
		</>
	)
}
export default Adminsignup