import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Reducer/userslice";
 
function Header() {
	const [term, setterm] = useState()
	const [name, setname] = useState("")
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { LoggedIn, PersonName } = useSelector((state) => {
		return state.userslice
	})

	const onclick = () => 
	{
		validation()
		if (term.length >= 3)
		 {
			search()
			setterm("")
		}
	}
	const validation = () => 
	{
		if (term.length < 3)
	    {
			setname('Name at least 3 characters long');
		}
		else {
			setname("")
		}
	};

	const onlogout = () => 
	{
		dispatch(logout())
		sessionStorage.clear()
		navigate("/login")
	}

	const func = () =>
    {
		navigate("/cart")
	}

	const search = () => {
		navigate({
			pathname: '/searchproducts',
			search: `?query=${term}`
		})
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
										<li><Link to="/myorders"> My Orders </Link></li>
										<li><Link to="/changepassword"> Change Password </Link></li>
										<button onClick={onlogout}>Logout</button>
									</> :
									<>
										<li><Link to="/login">Login</Link></li>
										<li><Link to="/signup">signup</Link></li>	 
									</>
							}
						</ul>
					</div>
					{
						LoggedIn ?
							<div className="product_list_header">

								<button className="w3view-cart" type="button" name="submit" value=""><i className="fa fa-cart-arrow-down" onClick={func} aria-hidden="true"></i></button>
							</div> : null
					}
					<div className="clearfix"> </div>
				</div>
			</div>

			<div className="logo_products">
				<div className="container">
					<div className="w3ls_logo_products_left1">
						<ul className="phone_email">
							<li><i className="fa fa-phone" aria-hidden="true"></i>Order online or call us : +91-78899 09868</li>
						</ul>
					</div>
					<div className="w3ls_logo_products_left">
						<h1><Link to="/">Della Spesa</Link></h1>
					</div>
					<div className="w3l_search">

						<input type="search" value={term} onChange={(e) => setterm(e.target.value)} name="Search" placeholder="Search for a Product..." required="" />

						<button type="submit" onClick={onclick} className="btn btn-default search" aria-label="Left Align">
							<i className="fa fa-search" aria-hidden="true"> </i>
						</button>
						{name ? <span>{name}</span> : null}
						<div className="clearfix"></div>
					</div>
					<div className="clearfix"> </div>
				</div>
			</div>
			<div className="navigation-agileits">
				<div className="container">
					<nav className="navbar navbar-default">
						<div className="collapse navbar-collapse" id="bs-megadropdown-tabs">
							<ul className="nav navbar-nav">
								<li><Link to="/homepage">Home</Link></li>
								<li><Link to="/showcategory">Products</Link></li>
								{
									LoggedIn ?
										<li><Link to="/contactus">ContactUs</Link></li>
										: null
								}
							</ul>
						</div>
					</nav>
				</div>
			</div>
		</>
	);
}

export default Header;
