// import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Reducer/userslice";
import { useDispatch, useSelector } from "react-redux";
function Adminheader() {
	// const[term,setterm]=useState()
	const navigate = useNavigate()

	const { PersonName, LoggedIn } = useSelector((state) => {
		return state.userslice
	})

	const dispatch = useDispatch()

	const onlogout = () => {
		// setuser(null)
		dispatch(logout())
		sessionStorage.clear()
		navigate("/login")
	}
	return (
		<>
			<div className="agileits_header">
				<div className="container">
					<div className="w3l_offers">
						<p>
							welcome {PersonName}
						</p>
					</div>
					<div className="agile-login">
						<ul>
							{
								LoggedIn ?
									<>
										<li><Link to="/createadmin">Create Admin</Link></li>
										<li><Link to="/changepassword"> Change Password </Link></li>
										<button onClick={onlogout}>Logout</button>
									</> :
									<>
										<li><Link to="/login">Login</Link></li>
										<li><Link to="/signup">signup</Link></li>
										<li><a href="contact.html">Help</a></li>
									</>
							}

						</ul>
					</div>

					<div className="clearfix"> </div>
				</div>
			</div>

			<div className="logo_products">
				<div className="container">
					<div className="w3ls_logo_products_left1">
						<ul className="phone_email">
							<li><i className="fa fa-phone" aria-hidden="true"></i>Order online or call us : +91-788992 78906</li>

						</ul>
					</div>
					<div className="w3ls_logo_products_left">
						<h1><Link to="/adminhome">Della Spesa </Link></h1>
					</div>

					<div className="clearfix"> </div>
				</div>
			</div>
			<div className="navigation-agileits">
				<div className="container">
					<nav className="navbar navbar-default">

						<div className="collapse navbar-collapse" id="bs-megadropdown-tabs">
							<ul className="nav navbar-nav">
								<li><Link to="/adminhomepage">Home</Link></li>

								<li className="dropdown">
									<a href="#" className="dropdown-toggle" data-toggle="dropdown">Manage
										<b className="caret"></b></a>
									<ul className="dropdown-menu multi-column columns-3">
										<div className="row">
											<div className="multi-gd-img">
												<ul className="multi-column-dropdown">
													<li><Link to="/categorymanage">Categories</Link></li>
													<li><Link to="/subcategorymanage">Subcategories</Link></li>
													<li><Link to="/productmanage">Product</Link></li>
												</ul>
											</div>
										</div>
									</ul>
								</li>

								<li className="dropdown">
									<a href="#" className="dropdown-toggle" data-toggle="dropdown">view<b className="caret"></b></a>
									<ul className="dropdown-menu multi-column columns-3">
										<div className="row">
											<div className="multi-gd-img">
												<ul className="multi-column-dropdown">

													<li><Link to="/vieworders ">Orders</Link></li>
													<li><Link to="/viewmember">Viewmember</Link></li>
													<li><Link to="/searchuser">Search user</Link></li>

												</ul>
											</div>
										</div>
									</ul>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</div>

		</>
	);
}

export default Adminheader;
