import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const images = [
    'images/slider1.jpg',
    'images/slider4.png',
    'images/slider5.png',
];

const Home = () => {
    const [latestprod, setlatestprod] = useState([])
    const [featuredprod, setfeacturedprod] = useState([])
    useEffect(() => {
        latestproduct()
        featuredproduct()
    }, [])

    const latestproduct = async () => {
        try {
            const res = await fetch("http://localhost:9000/api/latestprod")
            if (res.ok) {
                const result = await res.json()
                if (result.statuscode === 1) {
                    setlatestprod(result.proddata)
                }
                else {
                    toast.error(result.msg)
                }
            }
        }
        catch (err) {
            alert(err)
        }
    }

    const featuredproduct = async () => {
        try {
            const res = await fetch("http://localhost:9000/api/featuredprod")
            if (res.ok) {
                const result = await res.json()

                if (result.statuscode === 1) {
                    setfeacturedprod(result.proddata)
                }
                else {
                    toast.error(result.msg)
                }
            }
        }
        catch (err) {
            alert(err)
        }
    }

    return (
        <>
            <div className="slide-container">
                <Zoom scale={0.1}>
                    {
                       images.map((each, index) => <img key={index} style={{height: "400px", width:"100vw" }} src={each} />)
                    }
                </Zoom>
            </div>

            <div className="container">
                <div className="login">
                    {
                        latestprod.length > 0 ?
                            <>
                                <h2>Latest Products</h2><br />
                                {
                                    latestprod.map((data, i) =>
                                        <div key={i} className="col-md-4 top_brand_left">
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/productdetail?productid=${data._id}`}>
                                                                        <img alt="sub category pic" height="125" src={`uploads/${data.Product_pic}`} />
                                                                        <p>{data.Product_name}</p></Link>
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
            </div><br /><br />

            <div className="container">
                <div className="login">
                    {
                        featuredprod.length > 0 ?
                            <>
                                <h2>Featured Products</h2><br />
                                {
                                    featuredprod.map((data, i) =>
                                        <div key={i} className="col-md-4 top_brand_left">
                                            <div className="hover14 column">
                                                <div className="agile_top_brand_left_grid">
                                                    <div className="agile_top_brand_left_grid1">
                                                        <figure>
                                                            <div className="snipcart-item block" >
                                                                <div className="snipcart-thumb">
                                                                    <Link to={`/productdetail?productid=${data._id}`}>
                                                                        <img alt="sub category pic" height="125" src={`uploads/${data.Product_pic}`} />
                                                                        <p>{data.Product_name}</p></Link>
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
export default Home