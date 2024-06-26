import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

const Searchproduct = () => {
    const [prod, setprod] = useState([])
    const [params] = useSearchParams()
    const searchterm = params.get("query")

    useEffect(() => {
        searchproduct()
    }, [searchterm])

    const searchproduct = async () => {
        if (searchterm !== "") {
            try {
                const res = await fetch(`http://localhost:9000/api/searchprod/${searchterm}`)
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
            catch (err) {
                toast.error(err)
            }
        }
    }
    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><a href="index.html"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a></li>
                        <li className="active">Search Product</li>
                    </ol>
                </div>
            </div>
            <div className="container">
                <div className="login">
                    {
                        prod.length > 0 ?
                            <>
                                <h2>Products</h2><br />
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
export default Searchproduct