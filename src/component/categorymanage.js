import { useEffect, useState } from "react"
import { Link} from "react-router-dom"
import { toast } from "react-toastify"

const Categorymanage = () => {
	 const[cname,setcname]=useState()
     const[allcat,setallcat]=useState([])
	 const[pic,setpic]=useState(null)
	 const[catpic,setcatpic]=useState()
	 const[catid,setcatid]=useState()
	 const[flag,setflag]=useState(false)

     useEffect(()=>
     {
        fetchallcat()
     },[])

	 const onupdate=(catdata)=>
	 {
		setcname(catdata.collectionname)
		setcatpic(catdata.collectionpic)
		setcatid(catdata._id)
		setflag(true)
		// fetchallcat()
	 }

	 const oncancel=()=>
	 {
		setflag(false)
		setcname("")
		setpic(null)
	 }

	 const del= async(cid)=>
	 {
		const conf=window.confirm("Are you sure to delete it")
		if(conf===true)
		{
		try
		{
			const res=await fetch(`http://localhost:9000/api/deletecategories/${cid}`,
		{
			method:"delete"
		})
		if(res.ok)
		{
			const result= await res.json()
			if(result.statuscode===1)
			{
				// setallcat([])
				fetchallcat()
				toast.success("Category deleted")
			}
			else if(result.statuscode===0)
			{
				toast.error("error while deleted category")
			}
		}
		}
		catch(err)
		{
			toast.error(err)
		}
		}	
	 }

     var fetchallcat=async()=>
    {
        try 
        {
            const resp = await fetch("http://localhost:9000/api/fetchcategories")
            if(resp.ok)
            {
                var result = await resp.json(); 
                if(result.statuscode===0)
                {
                    toast.error("No Categories found");
                }
                else if(result.statuscode===1)
                {
                    setallcat(result.categorydata)
                }
            }
            else
            {
                toast.error("Error Occured")
            }
        }
        catch (err) 
        {
            toast.error(err);
        }
    }

     const onpicset=(e)=>
     {
        setpic(e.target.files[0])
     }
 
	 const onsubmit=async()=>
	 {
		const formdata= new FormData()
		if(flag===false)
		{
			formdata.append("category_name",cname)
			if(pic!==null)
			{
			  formdata.append("category_pic",pic)
			}
			try
			{
				const res=await fetch("http://localhost:9000/api/addcategory",
			{
				method:"post",
				body:formdata,
				headers:{authorization:`bearer${sessionStorage.getItem("token")}`}
			})
			if(res.ok)
			{
				const result = await res.json()
			    if(result.statuscode===1)
				{
					// setallcat([])	
					fetchallcat()
					toast.success("Category add successfull")
				}
				else if(result.statuscode===0)
				{
					toast.error("Category add not successfull")
				}
			}
			}
			catch(error)
			{
				toast.error(error)
			}	
		}
		else
		{
			formdata.append("category_name",cname)
			formdata.append("cid",catid)
			if(pic!==null)
			{
				formdata.append("cpic",pic)
			}
			formdata.append("oldpic",catpic)
		try
		{
				const res=await fetch("http://localhost:9000/api/updatecategory",
			{
				method:"put",
				body:formdata,
				headers:{authorization:`bearer${sessionStorage.getItem("token")}`}
			})
			if(res.ok)
			{
				const result=await res.json()
				if(result.statuscode===1)
				{
					// setallcat([])
					fetchallcat()
					toast.success("Category update successfull")
				}
				else if(result.statuscode===0)
				{
					toast.error("Category update not successfull")
				}
			}
		}
		catch(error)
		{
			toast.error(error)
		}	
	 }
	}
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Manage  Category</li>
					</ol>
				</div>
			</div>

			<div className="register">
				<div className="container">
					 <h2>Manage  Category</h2>
					<div className="login-form-grids">
                        
						<input type="text" name="subcategory name" placeholder=" category name" value={cname} required=" " onChange={(e) => setcname(e.target.value)} /><br/>
						{
							flag?<img src={`uploads/${catpic}`} alt="catpic" height="100"></img>:null
						}<br/><br/>
						
						<input type="file" name="category pic" onChange={onpicset} required=" "  /><br/>
						<button className="btn btn-primary" onClick={()=>onsubmit()}   >{flag?"Update":"Add"}</button>&nbsp;
						{flag?<button className="btn btn-pimary" onClick={oncancel}>Cancel</button>:null} 

					</div>
					<div className="register-home">
						<Link to="/homepage">Home </Link>
					</div><br/><br/>
					<h2>Added Categories</h2><br/>
						<table className="timetable_sub">
							<tbody>
								<tr>
									<th>Picture</th>
									<th>Name</th>
									<th>Update</th>
									<th>Delete</th>
								</tr>
								{
									allcat.map((data,i)=>
									<tr key={i}>
										<td><img src={`uploads/${data.collectionpic}`} alt="catpic" height="75"></img></td>
										<td>{data.collectionname}</td>
										<td><button onClick={()=>onupdate(data)} className="btn btn-primary">Update</button></td>
										<td><button onClick={()=>del(data._id)} className="btn btn-danger">Delete</button></td>
									</tr>)
								}
							</tbody>
						</table>
				</div>
			</div>
		</>
	)
}
export default Categorymanage