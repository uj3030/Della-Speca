import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

const Showsubcategory = () => {
    const [subcat, setsubcat] = useState([])
    const [params] = useSearchParams()
    const catid = params.get("catid")
    useEffect(() => {
        fetchallsubcat()
    }, [catid])

    const fetchallsubcat = async () => {
        if (catid !== "") {
            try {
                const res = await fetch(`http://localhost:9000/api/fetchsubcategories?cid=${catid}`)
                if (res.ok) {
                    const result = await res.json()
                    if (result.statuscode === 1) {
                        setsubcat(result.subcatdata)
                    }
                    else {
                        toast.error(result.msg)
                    }
                }
            }
            catch(err)
            {
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
                        <li className="active">Sub Categories</li>
                    </ol>
                </div>
            </div>
            <div className="container">
                <div className="login">
                    {
                        subcat.length > 0 ?
                            <>
                                <h2>Sub Categories</h2><br />
                                {
                                    subcat.map((data, i) =>
                                        <div key={i} className="col-md-4 top_brand_left">
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/product?subcatid=${data._id}`}><img alt="sub category pic" height="125" src={`uploads/${data.picture}`} />
                                                                        <p>{data.subcategoryname}</p></Link>
                                                                </div>
                                                            </div>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </> : <h2>No Categories Found</h2>
                    }
                </div>
            </div><br /><br /><br />
        </>
    )
}
export default Showsubcategory