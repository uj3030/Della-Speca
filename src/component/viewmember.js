import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const Viewmember = () => {
	const [memberlist, setmemberlist] = useState([])
	const [noofmember, setnoofmember] = useState([])

	useEffect(() => {
		apicall()
	}, [])

	const apicall = async () => {
		try {
			const res = await fetch("http://localhost:9000/api/viewallmembers")
			if (res.ok)
				var result = await res.json()
			if (result.statuscode === 0) {
				toast.error("Member not found")
			}
			else if (result.statuscode === 1) {
				setmemberlist(result.memberdata)
				setnoofmember(result.arraylength)
			}
		}
		catch(eerr)
		{
			toast.error(eerr)
		}
	}

	const del = async (id) => {
		const conf = window.confirm("are you sure to delete it")
		if (conf === true) {
			const res = await fetch(`http://localhost:9000/api/delmember/${id}`,
				{
					method: "delete"
				})
			if (res.ok) {
				const result = await res.json()
				if (result.statuscode === 1) {
					apicall()
					// setmemberlist([])
				}
				else {
					alert("error occur")
				}
			}
		}
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
					<h2>List of members</h2><br />
					{
						memberlist.length > 0 ?
							<div>
								<table className="timetable_sub">
									<tbody>
										<tr>
											<th>Name</th>
											<th>Phone</th>
											<th>Username</th>
											<th>Delete</th>
										</tr>
										{
											memberlist.map((data, i) =>
												<tr key={i}>
													<td>{data.pname}</td>
													<td>{data.phone}</td>
													<td>{data.username}</td>
													<td><button className="btn btn-danger" onClick={() => del(data._id)}>Delete</button>
													</td>
												</tr>)
										}
									</tbody>
								</table>
								<br />
								<b>{noofmember} user are found</b><br />
							</div>:<h2>Member not found</h2>
					}
				</div>
			</div>
		</>
	)
}
export default Viewmember