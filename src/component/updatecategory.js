import { useEffect, useState } from "react"
import { Link, useSearchParams} from "react-router-dom"
import { toast } from 'react-toastify';

const Updatecategory = () => 
{
	 const[subcname,setsubcname]=useState()
	 const[picname,setpicname]=useState()
	 const[catid,setcatid]=useState("")
	 const[subcatdata,setsubcatdata]=useState([])
     const[allcat,setallcat]=useState([])
	 const[pic,setpic]=useState(null)
	 const[msg,setmsg]=useState()
     const[params]=useSearchParams()
     const subcatid=params.get("scid")

 

     useEffect(()=>
     {
        fetchallcat()
        fetchsubcatdetails()
     },[])
     

     var fetchsubcatdetails=async()=>
     {
            try 
            {
                const resp = await fetch(`http://localhost:9000/api/fetchsubcatbyid?subcatid=${subcatid}`)
                if(resp.ok)
                {
                    var result = await resp.json(); 
                    if(result.statuscode===0)
                    {
                        toast.error("No subcategory details found");
                    }
                    else if(result.statuscode===1)
                    {
        
                    setsubcname(result.subcatdata.subcategoryname)  
                    setpicname(result.subcatdata.picture)
                    setcatid(result.subcatdata.category_id)
                }
                else
                {
                    setmsg("Error Occured")
                }
            }
        }
            catch (err) 
            {
                setmsg(err);
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
                    alert("No Categories found");
                }
                else if(result.statuscode===1)
                {
                    setallcat(result.categorydata)
                }
            }
            else
            {
                setmsg("Error Occured")
            }
        }
        catch (err) 
        {
            setmsg(err);
        }
    }


     const onpicset=(e)=>
     {
        setpic(e.target.files[0])
     }

     const formdata= new FormData()
     formdata.append("subcatid",subcatid)
     formdata.append("subcategoryname",subcname)
     formdata.append("category_id",catid)
     formdata.append("oldpic",picname)
     if(pic!==null)
     {
        formdata.append("pic",pic)
     }

	const onsubcatupdate=async()=>
    {
        
       const res=await fetch("http://localhost:9000/api/updatesubcategory",
       {
        method:"put",
        body:formdata
       })
	   if(res.ok)
	   {
		const result=await res.json()
		if(result.statuscode===1)
		{
			toast.success("Update subcategory successfull")
		}
		else
		{
			toast.error("Update subcategory not successfull")
		}
    }
}
    
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Update Sub Category</li>
					</ol>
				</div>
			</div>


			<div className="register">
				<div className="container">
					 <h2>Update Sub Category</h2>
					<div className="login-form-grids">
                        <select className="form-control" value={catid} onChange={(e)=>setcatid(e.target.value)}>
                            <option value="">Choose Category</option>
                        
                               {
                            allcat.map((data,i)=>
                                <option value={data._id} key={i}>{data.collectionname}</option>
                            )
                        }
                        </select>
						<input type="text" name="subcategory name" value={subcname} placeholder="sub category name" required=" " onChange={(e) => setsubcname(e.target.value)} /><br/>

                        <img src={`uploads/${picname}`} height="75" alt="subcatpic"></img><br/><br/>
                        <b>Choose image,if required</b><br/><br/>

						<input type="file" name="category pic" onChange={onpicset} required=" "  /><br/>
						<button onClick={onsubcatupdate} >update category</button><br/>
						{msg}

					</div>
					<div className="register-home">
						<Link to="/homepage">Home </Link>
					</div><br/><br/>
				</div>
			</div>
		</>
	)
}
export default Updatecategory