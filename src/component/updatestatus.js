import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

const Updatestatus = () => {
	const [updatestatus, setupdatestatus] = useState()
	const navigate = useNavigate()
    const[params]=useSearchParams()
    const orderid=params.get("oid")

	const updatest = async () =>
	 {
		try 
		{
            const value={updatestatus,orderid}
			const res = await fetch("http://localhost:9000/api/updatestatus",
            {
            method:"put",
            body:JSON.stringify(value),
            headers:
                    {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
            })
			if (res.ok)
				var result = await res.json()
			if (result.statuscode === 0) 
			{
				 toast.error("Error while update status")
			}
			else if (result.statuscode === 1)
		    {
                navigate("/vieworders")
				 toast.success("status updated")
        	}
		}
		catch(err)
		{
            toast.error("error")
		}
    }
    // const update=(oid)=>
    // {
	// 	navigate({
	// 		pathname:"/updatestatus",
	// 		search:`?oid=${oid}`
	// 	})
    // }
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">admin page</li>
					</ol>
				</div>
			</div>
			<div className="login">
				<div className="container">
					<h2>Update Status</h2><br />
                    <div className="login-form-grids">
                        	<select className="form-control" onChange={(e)=>setupdatestatus(e.target.value)}>
                        <option>Choose Status</option>
                        <option>Out For Deivery</option>
                        <option>Delivered</option>
                        <option>Canceled</option>
                    </select><br/>
                    <button className="btn btn-primary" onClick={updatest}>confrim</button>
                    </div>
				</div>
			</div>
		</>
	)
}
export default Updatestatus