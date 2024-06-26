import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  
const  Updateproduct = () => {
	 const[productname,setproductname]=useState()
	 const[rate,setrate]=useState()
	 const[discount,setdiscount]=useState()
	 const[stock,setstock]=useState()
	 const[desc,setdesc]=useState()
	 const[picname,setpicname]=useState()
	 const[catid,setcatid]=useState()
	 const[subcatid,setsubcatid]=useState()
	 const[featured,setfeatured]=useState()
     const[allcat,setallcat]=useState([])
     const[allsubcat,setallsubcat]=useState([])
	 const[pic,setpic]=useState()
     const [params]=useSearchParams()
     const prodid=params.get("prodid")
	  

     useEffect(()=>
     {
        fetchallcat()
     },[])

     useEffect(()=>
     {
        fetchallsubcat()
     },[catid])

     useEffect(()=>
     {
        fetchprodbyid()
     },[prodid])
 
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
                    alert("please add categories first then and product");
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

    const fetchallsubcat=async()=>
    {
        if(catid!==undefined)
    {
        setallsubcat([])
        try
        {
       const res=await fetch(`http://localhost:9000/api/fetchsubcategories?cid=${catid}`)
       if(res.ok)
       {
        const result=await res.json()
         
        if(result.statuscode===1)
        {
            setallsubcat(result.subcatdata)
        }
        else
        {
            toast.error(result.msg)
        }
       }
       }
       catch
       {

       }
    }
    }
 
    var fetchprodbyid=async()=>
    {
        try 
        {
            const resp = await fetch(`http://localhost:9000/api/fetchprodbyid/${prodid}`)
            if(resp.ok)
            {
                var result = await resp.json(); 
                if(result.statuscode===0)
                {
                    toast.error("No product details found");
                }
                else if(result.statuscode===1)
                {
         		    setcatid(result.proddata.category_id);
                    setsubcatid(result.proddata.Subcategory_id);
                    setproductname(result.proddata.Product_name);
                    setrate(result.proddata.Rate);
                    setdiscount(result.proddata.Discount);
                    setstock(result.proddata.Stock);
                    setdesc(result.proddata.Discription);
                    setfeatured(result.proddata.Featured);
                    setpicname(result.proddata.Product_pic);
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


     const formdata= new FormData()
     formdata.append("productname",productname)
     if(pic!==null)
     {
        formdata.append("pic",pic)
     }
     formdata.append("category_id",catid)
     formdata.append("subcategory_id",subcatid)
     formdata.append("discount",discount)
     formdata.append("rate",rate)
     formdata.append("discription",desc)
     formdata.append("oldpic",picname)
     formdata.append("stock",stock)
     formdata.append("featured",featured)

	const updateproduct=async()=>
    {
        try
        {
            const res=await fetch(`http://localhost:9000/api/updateproduct/${prodid}`,
       {
        method:"put",
        body:formdata
       })
	   if(res.ok)
	   {
		const result=await res.json()
		if(result.statuscode===1)
		{
			toast.success("update product successfull")
		}
		else
		{
			toast.error("update product not successfull")
		}
	   }
        }
        catch(err)
        {
            toast.error("error")
        }
       
    }   
    
	return (
		<>
			<div className="breadcrumbs">
				<div className="container">
					<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
						<li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
						<li className="active">Product Manage</li>
					</ol>
				</div>
			</div>


			<div className="register">
				<div className="container">
					 <h2>Product Update</h2>
					<div className="login-form-grids">
                        <select className="form-control" value={catid} onChange={(e)=>setcatid(e.target.value)}>
                            <option value="">Choose Category</option>
                        
                               {
                            allcat.map((data,i)=>
                                <option value={data._id} key={i}>{data.collectionname}</option>
                            )
                        }
                        </select><br/>
                        <select className="form-control" value={subcatid} onChange={(e)=>setsubcatid(e.target.value)}>
                            <option>Choose Sub Category</option>
                        
                               {
                            allsubcat.map((data,i)=>
                                <option value={data._id} key={i}>{data.subcategoryname}</option>
                            )
                        }
                        </select><br/>
						<input type="text" name="product name" placeholder="product name" required=" " value={productname} onChange={(e) => setproductname(e.target.value)} /><br/>
						<input type="text" name="rate" placeholder="rate" required=" " value={rate} onChange={(e) => setrate(e.target.value)} /><br/>
						<input type="text" name="discount" placeholder="discount" required=" " value={discount} onChange={(e) => setdiscount(e.target.value)} /><br/>
						<input type="text" name="stock" placeholder="stock" required=" " value={stock} onChange={(e) => setstock(e.target.value)} /> <br/>
                        <textarea name="description" className="form-control" placeholder="Description" required=" " value={desc} onChange={(e)=>setdesc(e.target.value)}></textarea><br/>
                         Featured Product&nbsp;&nbsp;
                      
                        <label><input type="radio" checked={featured==='yes'} onChange={(e)=>setfeatured(e.target.value)} name="featured" value="yes"/>Yes</label>&nbsp;
                        <label><input type="radio" checked={featured==='no'}  onChange={(e)=>setfeatured(e.target.value)} name="featured" value="no"/>No</label><br/><br/>

                        {/* <img src={`/uploads/${picname}`} height="75" alt="prodpic"></img><br/><br/>
                        <b>Choose image,if required</b><br/><br/> */}
                       <img src={`/uploads/${picname}`} alt='prodpic"' height="100"/><br/><br/><b>Choose new image, if required</b><br/>
                       
						<input type="file" name="category pic" onChange={onpicset} required=" "  /><br/>
						<button onClick={updateproduct} className="btn btn-primary" >Update Product</button><br/>
						 

					</div>
					<div className="register-home">
						<Link to="/homepage">Home </Link>
					</div><br/><br/>
 
				</div>
			</div>
		</>
	)
}
export default Updateproduct






 