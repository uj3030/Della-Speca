import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
const Vieworders = () => {
	const [orderlist, setorderlist] = useState([])
	const [noofmember, setnoofmember] = useState([])
	const navigate = useNavigate()
	
	useEffect(() => {
		fetchorders()
	},[])

	const fetchorders = async () =>
	 {
		try 
		{
			const res = await fetch("http://localhost:9000/api/fetchorders")
			if (res.ok)
				var result = await res.json()
			if (result.statuscode === 0) 
			{
				 toast.error("Order not found")
			}
			else if (result.statuscode === 1)
		    {
				setorderlist(result.orderdata)
				// setnoofmember(result.arraylength)
        	}
		}
		catch(err)
		{
            toast.error("error")
		}
    }

    const update=(oid)=>
    {
		navigate({
			pathname:"/updatestatus",
			search:`?oid=${oid}`
		})
    }
 
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">admin page</li>
					</ol>
				</div>
			</div>

			<div className="login">
				<div className="container">
					<h2>List of orders</h2><br />
					{
						orderlist.length>0?
							<div>

								<table className="timetable_sub">
									<tbody>
										<tr>
											<th>Order id</th>
											<th>Address</th>
											<th>Username</th>
											<th>Date/time</th>
											<th>Payment Mode</th>
											<th>Status</th>
											<th>Status Update</th>
										</tr>
										{
											orderlist.map((data, i) =>
												<tr key={i}>
													<td><Link to={`/orderproducts?oid=${data._id}`}>{data._id}</Link></td>
													<td>{data.address}</td>
													<td>{data.username}</td>
													<td>{data.OrderDate}</td>
													<td>{data.pmode}</td>
													<td>{data.status}</td>
													<td><button className="btn btn-primary" onClick={() =>update(data._id)}>Update</button>
													</td>
												</tr>)
										}
									</tbody>
								</table>
					<br/>
					{/* <b>{noofmember} user are found</b><br /> */}
					</div> : null
					}
					 
				</div>
			</div>
		</>
	)
}
export default Vieworders

 