import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Productmanage = () => {
    const [productname, setproductname] = useState()
    const [rate, setrate] = useState()
    const [discount, setdiscount] = useState()
    const [stock, setstock] = useState()
    const [desc, setdesc] = useState()
    const [catid, setcatid] = useState("")
    const [subcatid, setsubcatid] = useState()
    const [featured, setfeatured] = useState()
    const [allcat, setallcat] = useState([])
    const [allsubcat, setallsubcat] = useState([])
    const [proddata, setproddata] = useState([])
    const [pic, setpic] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        fetchallcat()
    }, [])

    useEffect(() => {
        fetchallsubcat()
    }, [catid])

    useEffect(() => {
        fetchprod()
    }, [subcatid])

    const del = async (pid) => {
        const conf = window.confirm("Are you sure to delete it")
        if (conf === true) {
            try {
                const res = await fetch(`http://localhost:9000/api/deleteproduct/${pid}`,
                    {
                        method: "delete"
                    })
                if (res.ok) {
                    const result = await res.json()
                    if (result.statuscode === 1) {
                        setproddata([])
                        fetchprod()
                        toast.success("product deleted")
                    }
                    else if (result.statuscode === 0) {
                        toast.error("error while delete product")
                    }
                }
            }
            catch (err)
            {
                toast.error(err)
            }
        }
    }

    var fetchallcat = async () => {
        try {
            const resp = await fetch("http://localhost:9000/api/fetchcategories")
            if (resp.ok) {
                var result = await resp.json();
                if (result.statuscode === 0) {
                    alert("please add categories first then and product");
                }
                else if (result.statuscode === 1) {
                    setallcat(result.categorydata)
                }
            }
            else {
                toast.error("Error Occured")
            }
        }
        catch (err) {
            toast.error(err);
        }
    }

    const fetchallsubcat = async () => {
        if (catid !== "") {
            setallsubcat([])
            setproddata([])
            try {
                const res = await fetch(`http://localhost:9000/api/fetchsubcategories?cid=${catid}`)
                if (res.ok) {
                    const result = await res.json()

                    if (result.statuscode === 1) {
                        setallsubcat(result.subcatdata)
                    }
                    else {
                        toast.error(result.msg)
                    }
                }
            }
            catch(error)
            {
                toast.error(error)
            }
        }
    }

    var fetchprod = async () => {
        if (subcatid !== undefined) {
            try
            {
                const resp = await fetch(`http://localhost:9000/api/fetchprod?scid=${subcatid}`)
                if (resp.ok) {
                    var result = await resp.json();
                    if (result.statuscode === 0) {
                        setproddata([]);
                    }
                    else if (result.statuscode === 1) {
                        setproddata(result.proddata)
                    }
                }
                else {
                    toast.error("Error Occured")
                }
            }
            catch (err)
            {
                toast.error(err);
            }
        }
    }

    const onupdate = (prodid) => {
        navigate({
            pathname: '/updateproduct',
            search: `?prodid=${prodid}`,
        });
    }

    const onpicset = (e) => {
        setpic(e.target.files[0])
    }

    const formdata = new FormData()
    formdata.append("productname", productname)
    formdata.append("pic", pic)
    formdata.append("category_id", catid)
    formdata.append("subcategory_id", subcatid)
    formdata.append("discount", discount)
    formdata.append("rate", rate)
    formdata.append("discription", desc)
    formdata.append("stock", stock)
    formdata.append("featured", featured)

    const onproductadd = async () => {
        try
        {
            const res = await fetch("http://localhost:9000/api/addproduct",
            {
                method: "post",
                body: formdata
            })
            if (res.ok)
            {
                const result = await res.json()
                if (result.statuscode === 1) {
                    setproddata([])
                    fetchprod()
                    toast.success("add product successfull")
                }
                else {
                    toast.error("add product not successfull")
                }
            }
        }
        catch(error)
        {
            toast.error(error)
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Product Manage</li>
                    </ol>
                </div>
            </div>

            <div className="register">
                <div className="container">
                    <h2>Product Add</h2>
                    <div className="login-form-grids">
                        <select className="form-control" onChange={(e) => setcatid(e.target.value)}>
                            <option value="">Choose Category</option>

                            {
                                allcat.map((data, i) =>
                                    <option value={data._id} key={i}>{data.collectionname}</option>
                                )
                            }
                        </select><br />
                        <select className="form-control" onChange={(e) => setsubcatid(e.target.value)}>
                            <option>Choose Sub Category</option>

                            {
                                allsubcat.map((data, i) =>
                                    <option value={data._id} key={i}>{data.subcategoryname}</option>
                                )
                            }
                        </select><br />
                        <input type="text" name="product name" placeholder="product name" required=" " onChange={(e) => setproductname(e.target.value)} /><br />
                        <input type="text" name="rate" placeholder="rate" required=" " onChange={(e) => setrate(e.target.value)} /><br />
                        <input type="text" name="discount" placeholder="discount" required=" " onChange={(e) => setdiscount(e.target.value)} /><br />
                        <input type="text" name="stock" placeholder="stock" required=" " onChange={(e) => setstock(e.target.value)} /><br />
                        <textarea name="description" className="form-control" placeholder="Description" required=" " onChange={(e) => setdesc(e.target.value)}></textarea><br />
                        Featured Product&nbsp;&nbsp;

                        <label><input type="radio" checked={featured === 'yes'} onChange={(e) => setfeatured(e.target.value)} name="featured" value="yes" />Yes</label>&nbsp;
                        <label><input type="radio" checked={featured === 'no'} onChange={(e) => setfeatured(e.target.value)} name="featured" value="no" />No</label><br /><br />

                        <input type="file" name="category pic" onChange={onpicset} required=" " /><br />
                        <button onClick={onproductadd} className="btn btn-primary">Add Product</button><br />
                    </div>
                    <div className="register-home">
                        <Link to="/homepage">Home </Link>
                    </div><br /><br />

                    {
                        proddata.length > 0 ?
                            <div>
                                <h2>Added Product</h2><br />

                                <table className="timetable_sub">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>Picture</th>
                                            <th>Rate</th>
                                            <th>Discount</th>
                                            <th>Stock</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                        {
                                            proddata.map((data, i) =>
                                                <tr key={i}>
                                                    <td>{data.Product_name}</td>
                                                    <td><img src={`uploads/${data.Product_pic}`} alt="prodpic" height="75"></img></td>
                                                    <td>{data.Rate}</td>
                                                    <td>
                                                        {
                                                            data?.discount ? data.discount : "0"
                                                        }
                                                    </td>
                                                    <td>{data.Stock}</td>
                                                    {/* <td><Link to={`/updatesubcategory?scid=${data._id}`}><button>Update</button></Link></td> */}
                                                    <td><button className="btn btn-primary" onClick={() => onupdate(data._id)}>Update</button></td>
                                                    <td><button className="btn btn-danger" onClick={() => del(data._id)}>Delete</button></td>
                                                </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div> : null
                    }
                </div>
            </div>
        </>
    )
}
export default Productmanage