import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const Showcategory = () => {
    const [allcat, setallcat] = useState([])
    useEffect(() => {
        fetchallcat()
    }, [])
    var fetchallcat = async () => {
        try {
            const resp = await fetch("http://localhost:9000/api/fetchcategories")
            if (resp.ok) {
                var result = await resp.json();
                if (result.statuscode === 0) {
                    toast.error("No Categories found");
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
            toast.error("error");
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/homepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Categories</li>
                    </ol>
                </div>
            </div>
            <div className="container">
                <div className="login">
                    {
                        allcat.length > 0 ?
                            <>
                                <h2>Categories</h2><br />
                                {
                                    allcat.map((data, i) =>
                                        <div key={i} className="col-md-4 top_brand_left">
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/showsubcategories?catid=${data._id}`}><img title=" " alt="category pic" height="125" src={`uploads/${data.collectionpic}`} />
                                                                        <p>{data.collectionname}</p></Link>
                                                                </div>
                                                            </div>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </> : <h2>No Categories Found</h2>
                    }
                </div>
            </div><br /><br /><br />
        </>
    )
}
export default Showcategory