import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

const Showproduct = () => {
    const [prod, setprod] = useState([])
    const [filter, setfilter] = useState()
    const [params] = useSearchParams()
    const subcatid = params.get("subcatid")

    useEffect(() => {
        fetchproduct()
    }, [subcatid])
    useEffect(() => {
        fetchproduct()
    }, [filter])

    const fetchproduct = async () => {
        if (subcatid !== "") {
            try {
                const res = await fetch(`http://localhost:9000/api/fetchprod?scid=${subcatid}&filter=${filter}`)
                if (res.ok) {
                    const result = await res.json()

                    if (result.statuscode === 1) {
                        setprod(result.proddata)
                    }
                    else {
                        toast.error(result.msg)
                    }
                }
            }
            catch (error) {
                toast.error(error)
            }
        }
    }
    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><a href="index.html"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li>
                        <li className="active">Product</li>
                    </ol>
                </div>
            </div>
            <div className="container">
                <div className="login">
                    {
                        prod.length > 0 ?
                            <>
                                <h2>Products</h2><br />
                                <select className="form-control" onChange={(e) => setfilter(e.target.value)}>
                                    <option>Add Filter</option>
                                    <option value="ascending">(A-Z)</option>
                                    <option value="lowtohigh">(Low-High)</option>
                                    <option value="hightolow">(High-Low)</option>
                                </select>
                                <br />
                                {
                                    prod.map((data, i) =>
                                        <div key={i} className="col-md-4 top_brand_left">
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/productdetail?productid=${data._id}`}>
                                                                        <img alt="sub category pic" height="125" src={`uploads/${data.Product_pic}`} /></Link>
                                                                    <p>{data.Product_name}</p>
                                                                    <p><b>Rs-{data.Rate}/-</b></p>
                                                                </div>
                                                            </div>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </> : <h2>No Product Found</h2>
                    }
                </div>
            </div><br /><br /><br />
        </>
    )
}
export default Showproduct