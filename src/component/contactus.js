import { useContext, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
// import usercontext from "./usercontext"
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify"

const Contactus = () => {
	// const {setuser}=useContext(usercontext)
	const [name, setname] = useState()
	const [email, setemail] = useState()
	const [phn, setphn] = useState()
	const [msg, setmsg] = useState()
	const [cverification, setcverification] = useState(false)

	const onChange = (value) => {
		if (value) {
			setcverification(true)
		}
		else {
			setcverification(false)
		}
	}

	const onsubmit = async () => {
		if (cverification === true) {
			const value = { name, email, phn, msg }
			try {
				const res = await fetch("http://localhost:9000/api/contactus",
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
					toast.info(result.msg)
				}
			}
			catch (error) {
				toast.error(error)
			}
		}
		else {
			toast.error("Please verify captcha")
		}
	}
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li>< Link to="/"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active"> ContactUs</li>
					</ol>
				</div>
			</div>

			<div className="login">
				<div className="container">
					<h2>ContactUs</h2>

					<div className="login-form-grids animated wow slideInUp" data-wow-delay=".5s">
						<form>
							<input type="text" placeholder="your name" name="pname" onChange={(e) => setname(e.target.value)} /><br />
							<input type="text" placeholder="your phone no." name="phone no." onChange={(e) => setphn(e.target.value)} /><br />
							<input type="email" placeholder="your email address" name="email" onChange={(e) => setemail(e.target.value)} /><br />
							<textarea className="form-control" placeholder="massage" name="massage" onChange={(e) => setmsg(e.target.value)}></textarea><br />
							<ReCAPTCHA sitekey="6LfjA5ImAAAAAItnAwNJjuHtcKdDXxV0BFWDK41C" onChange={onChange} /><br />

							<input type="button" className="btn btn-primary" onClick={onsubmit} value="Submit" />
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
export default Contactus