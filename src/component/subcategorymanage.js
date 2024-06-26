import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

const Subcategorymanage = () => {
    const [subcname, setsubcname] = useState()
    const [catid, setcatid] = useState("")
    const [subcatdata, setsubcatdata] = useState([])
    const [allcat, setallcat] = useState([])
    const [pic, setpic] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        fetchallcat()
    }, [])

    useEffect(() => {
        fetchsubcategories()
        setsubcname("")
    }, [catid])

    const del = async (subcatid) => {
        const conf = window.confirm("Are you sure to delete it")
        if (conf === true) {
            try {
                const res = await fetch(`http://localhost:9000/api/deletesubcategories/${subcatid}`,
                    {
                        method: "delete"
                    })
                if (res.ok) {
                    const result = await res.json()
                    if (result.statuscode === 1) {
                        // setsubcatdata([])
                        fetchsubcategories()
                        toast.success("Sub Category deleted")
                    }
                    else if (result.statuscode === 0) {
                        toast.error("error while deleted subcategory")
                    }
                }
            }
            catch (err) {
                toast.error(err)
            }
        }
    }

    const fetchsubcategories = async () => {
        setsubcatdata([])
        if (catid !== "") {
            try {
                const res = await fetch(`http://localhost:9000/api/fetchsubcategories?cid=${catid}`)
                if (res.ok) {
                    const result = await res.json()
                    if (result.statuscode === 1) {
                        setsubcatdata(result.subcatdata)
                    }
                }
            }
            catch(error)
            {
                toast.error(error)
            }
        }
    }

    var fetchallcat = async () => {

        try {
            const resp = await fetch("http://localhost:9000/api/fetchcategories")
            if (resp.ok) {
                var result = await resp.json();
                if (result.statuscode === 0) {
                    alert("No Categories found");
                }
                else if (result.statuscode === 1) {
                    setallcat(result.categorydata)
                }
            }
            else {
                toast.err("Error Occured")
            }
        }
        catch (err) {
            toast.error(err);
        }
    }

    const onpicset = (e) => {
        setpic(e.target.files[0])
    }

    const onupdate = (subcatid) => {
        navigate({
            pathname: '/updatesubcat',
            search: `?scid=${subcatid}`,
        });
    }

    const formdata = new FormData()
    formdata.append("subcategoryname", subcname)
    formdata.append("pic", pic)
    formdata.append("category_id", catid)

    const onsubcatadd = async () => {

        const res = await fetch("http://localhost:9000/api/addsubcategory",
            {
                method: "post",
                body: formdata
            })
        if (res.ok) {
            const result = await res.json()
            if (result.statuscode === 1) {
                // setsubcatdata([])
                fetchsubcategories()
                toast.success("add subcategory successfull")
            }
            else {
                toast.error("add subcategory not successfull")
            }
        }
    }

    return (
        <>
            <div className="breadcrumbs">
                <div className="container">
                    <ol className="breadcrumb breadcrumb1 animated wow slideInLeft" data-wow-delay=".5s">
                        <li><Link to="/adminhomepage"><span className="glyphicon glyphicon-home" aria-hidden="true"></span>Home</Link></li>
                        <li className="active">Manage Sub Category</li>
                    </ol>
                </div>
            </div>

            <div className="register">
                <div className="container">
                    <h2>Manage Sub Category</h2>
                    <div className="login-form-grids">
                        <select className="form-control" onChange={(e) => setcatid(e.target.value)}>
                            <option value="">Choose Category</option>
                            {
                                allcat.map((data, i) =>
                                    <option value={data._id} key={i}>{data.collectionname}</option>
                                )
                            }
                        </select>
                        <input type="text" name="subcategory name" placeholder="sub category name" value={subcname}required=" " onChange={(e) => setsubcname(e.target.value)} /><br />
                        <input type="file" name="category pic" onChange={onpicset} required=" " /><br />
                        <button onClick={onsubcatadd} className="btn btn-primary">Add Sub category</button><br />
                    </div>
                    <div className="register-home">
                        <Link to="/homepage">Home </Link>
                    </div><br /><br />
                    {
                        subcatdata.length > 0 ?
                            <div>
                                <h2>Added Sub Categories</h2><br />

                                <table className="timetable_sub">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>Picture</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                        {
                                            subcatdata.map((data, i) =>
                                                <tr key={i}>
                                                    <td>{data.subcategoryname}</td>
                                                    <td><img src={`uploads/${data.picture}`} alt="catpic" height="75"></img></td>
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
export default Subcategorymanage