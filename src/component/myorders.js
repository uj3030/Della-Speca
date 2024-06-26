import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
// import usercontext from "./usercontext"
const Myorders = () => {
	const [orderlist, setorderlist] = useState([])
	const { username, LoggedIn } = useSelector((state) => {
		return state.userslice
	})
	// const {user}= useContext(usercontext)
	useEffect(() => {
		if (LoggedIn) {
			fetchmyorders()
		}
	}, [LoggedIn])

	const fetchmyorders = async () => {
		try {
			const res = await fetch(`http://localhost:9000/api/fetchmyorders/${username}`)
			if (res.ok)
				var result = await res.json()
			if (result.statuscode === 0) {
				toast.error("Order not found")
			}
			else if (result.statuscode === 1) {
				setorderlist(result.orderdata)
			}
		}
		catch (err) {
			toast.error("error")
		}
	}

	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Order History</li>
					</ol>
				</div>
			</div>

			<div className="login">
				<div className="container">
					{
						orderlist.length > 0 ?
							<div>
								<h2>List of orders</h2><br />
								<table className="timetable_sub">
									<tbody>
										<tr>
											<th>Order id</th>
											<th>Address</th>
											<th>UserName</th>
											<th>Date/time</th>
											<th>Payment Mode</th>
										</tr>
										{
											orderlist.map((data, i) =>
												<tr key={i}>
													<td><Link to={`/orderproducts?oid=${data._id}`}>{data._id}</Link></td>
													<td>{data.address}</td>
													<td>{data.username}</td>
													<td>{data.OrderDate}</td>
													<td>{data.pmode}</td>
												</tr>)
										}
									</tbody>
								</table>
								<br />
							</div> : <h2>You did not order anything</h2>
					}
				</div>
			</div>
		</>
	)
}
export default Myorders