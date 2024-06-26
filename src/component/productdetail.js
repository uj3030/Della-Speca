// import { useContext } from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
// import usercontext from "./usercontext"
const Productdetail = () => {
	const [productname, setproductname] = useState()
	const [rate, setrate] = useState()
	const [discount, setdiscount] = useState()
	const [stock, setstock] = useState()
	const [picname, setpicname] = useState()
	const [description, setdescription] = useState()
	const [qty, setqty] = useState()
	const [featured, setfeatured] = useState()
	const [remainingamt, setremainingamt] = useState()
	const [ availablestock] = useState([])
	const [params] = useSearchParams()
	const prodid = params.get("productid")
	// const{user}=useContext(usercontext)
	const navigate=useNavigate()
	 
	const {LoggedIn,username}=useSelector((state)=>
	{
		return state.userslice
	})

	useEffect(() => {
		fetchprodbyid()
	}, [])

	useEffect(() => {
		const dis = discount || "0";
		setremainingamt(parseInt(rate)-parseInt(dis))
	}, [rate],[discount])

	useEffect(()=>
	{
		if(stock>5)
		{
			for(var i=1;i<=5;i++)
			{
				availablestock.push(i)
			}
		}
		else
		{
			for(var i=1;i<=stock;i++)
			{
				availablestock.push(i)
			}
		}
	},[stock])
	 
var onaddtocart=async()=>
{
  var totalcost = remainingamt*qty;
  var uname=username
   const cartdata={prodid,productname,prize:remainingamt,qty,totalcost,picname,stock,uname}
	if(LoggedIn)
	{ 
		try 
		{
			const resp = await fetch(`http://localhost:9000/api/checkcart?uname=${uname}&prodid=${prodid}`)
			if(resp.ok)
			{
				var result = await resp.json();
				if(result.statuscode===3)
				{
					try
					{
						const res = await fetch("http://localhost:9000/api/addtocart",
						{
							method: "post",
							body: JSON.stringify(cartdata),
							headers:
							{
								'Content-type': 'application/json; charset=UTF-8',
							}
						})
							if(res.ok)		
							{
								var result = await res.json();
								if(result.statuscode===1)
								{
									navigate("/cart");
								}
								else if(result.statuscode===0)
								{
									toast.error("Error while adding to cart, try again");
								}
							}
							else
							{
								toast.error("Error Occured in addtocart api")
							}
					}
					catch (error)
					{
						toast.error(error)
					}

				}
				else if(result.statuscode===2)
				{
					try
					{
						const res = await fetch("http://localhost:9000/api/updatecart",
						{
							method: "put",
							body: JSON.stringify(cartdata),
							headers:
							{
								'Content-type': 'application/json; charset=UTF-8',
							}
						})
							if(res.ok)		
							{
								var result = await res.json();
								if(result.statuscode===1)
								{
									navigate("/cart");
								}
								else if(result.statuscode===0)
								{
									toast.error("Error while adding to cart, try again");
								}
							}
							else
							{
								toast.error("Error Occured in updatecart api")
							}
					}
					catch (error)
					{
						toast.error(error)
					}
				}
			}
			else
			{
				alert("error in checkcart api")
			}
											
		}
		catch (err) 
		{
			toast.error(err);
		}									
	}
	else
	{
	    toast.error("Please login to add product to cart");
		navigate({
				pathname: '/login',
				search: `?pid=${prodid}`,
				});
	}
}

	var fetchprodbyid = async () => {
		try {
			const res = await fetch(`http://localhost:9000/api/fetchprodbyid/${prodid}`)
			if (res.ok) {		 
				const result = await res.json()
				if (result.statuscode === 1) {
					setproductname(result.proddata.Product_name);
					setrate(result.proddata.Rate);
					setdiscount(result.proddata.Discount);
					setstock(result.proddata.Stock);
					setdescription(result.proddata.Discription);
					setfeatured(result.proddata.Featured);
					setpicname(result.proddata.Product_pic);
				}
				else {
					toast.error(result.msg)
				}
			}
		}
		catch(err)
		{
			alert(err)
		}
	}

return (
	<>
		<div className="breadcrumbs">
			<div className="container">
				<ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
					<li><a href="index.html"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li>
					<li className="active">Product Detail</li>
				</ol>
			</div>
		</div>

		<div class="products">
			<div class="container">
				<div class="agileinfo_single">
					<div class="col-md-4 agileinfo_single_left">
						<img id="example" src={`uploads/${picname}`} alt="prodpic" class="img-responsive" />
					</div>
					<div class="col-md-8 agileinfo_single_right">
						<h2>{productname}</h2>
						<div class="w3agile_description">
							<h4>Description :</h4>
							<p>{description}</p>
						</div>
						<div class="snipcart-item block">
							<div class="snipcart-thumb agileinfo_single_right_snipcart">
								<h4 class="m-sing"> Rs-{remainingamt}/- <span>Rs-{rate}/-</span></h4>
							</div>
							<div class="snipcart-details agileinfo_single_right_details">
							{
								stock>0?
					            <>
									<select className="form-control" onChange={(e)=>setqty(e.target.value)}>
									<option>Choose Quantity</option>
									{
										availablestock.map((data,i)=>
										<option key={i}>{data}</option>
										)
									}
								</select><br/>

							    <fieldset>
										<input type="button" name="submit" value="Add to cart" onClick={onaddtocart} className="button"/>
									</fieldset>
								</>:<b>Out of stock</b>
							}
							</div>
						</div>
					</div>
					<div class="clearfix"> </div>
				</div>
			</div>
		</div>
	</>
)
}
export default Productdetail





 