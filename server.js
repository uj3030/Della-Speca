const express = require("express")
const app = express()
require('dotenv').config()
// const port = process.env.REACT_APP_PORT
const port = process.env.PORT || 9000
// const port=9000
const fs = require("fs")
const nodemailer = require("nodemailer")
const uuid = require("uuid")
var jwt = require('jsonwebtoken')

const transporter = nodemailer.createTransport({
    service: 'outlook',
    secure: false,
    auth: {
        user: 'ecomapp@outlook.com',
        pass: '7058@tarun'
    }
})

const multer = require("multer")
let picname
const mystorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        picname = Date.now() + file.originalname
        cb(null, picname)
    }
})
const upload = multer({ storage: mystorage })

const cors = require("cors")
app.use(cors())

const bcrypt = require('bcrypt')

app.listen(port, () => {
    console.log("server is running")
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const verifytoken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.send({ msg: "unauthorization subject" })
    }
    const token = req.headers.authorization.split('')[1]
    if (!token) {
        res.send({ msg: "unauthorization subject" })
    }
    else {
        const payload = jwt.sign(token, process.env.TOKEN_KEY)

        if (!payload) {
            res.send({ msg: "unauthorization subject" })
        }
        else {
            next()
        }
    }
}

const mongoose = require("mongoose")
const { Console } = require("console")
mongoose.connect("mongodb://127.0.0.1:27017/ecomdb")
// mongoose.connect("mongodb+srv://ts9861840:onMXD8uR0lvR8wnh@cluster0.f8bfebj.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("connected")
    })

const registerschema = new mongoose.Schema({ pname: String, phone: String, username: { type: String, unique: true }, password: String, usertype: String, isActive: Boolean, ActivationToken: String }, { versionKey: false })
const registermodel = mongoose.model('register', registerschema, "register")

const collectionschema = new mongoose.Schema({ collectionname: String, collectionpic: String }, { versionKey: false })
const collectionmodel = mongoose.model("category", collectionschema, "category")

//api for category delete
app.delete("/api/deletecategories/:cid", async (req, res) => {
    const result = await collectionmodel.findByIdAndRemove({ _id: req.params.cid })
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//register api
app.post("/api/register", async (req, res) => {
    const findresult = await registermodel.findOne({ username: req.body.username })
    if (findresult) {
        res.send({ statuscode: 2, msg: "Email id already exits" })
    }
    else {
        const hash = bcrypt.hashSync(req.body.pass, 10)
        var token = uuid.v4()
        let registerdata = new registermodel({ pname: req.body.pname, phone: req.body.phone, username: req.body.username, password: hash, usertype: req.body.usertype, isActive: false, ActivationToken: token })
        const registerresult = await registerdata.save()
        if (registerresult) {
            const mailformat = {
                from: "ecomapp@outlook.com",
                to: req.body.username,
                subject: "Account acctivaton mail from Shopping Plaza.com",
                text: `Hello ${req.body.pname}\n\nThanks for signing up for our website.Please click on below given link to activate your account\n\nhttp://localhost:3000/activateaccount?token=${token}`
            }
            transporter.sendMail(mailformat, (error, succ) => {
                if (error) {
                    res.send({ msg: "Error while sending mail try again" })
                }
                else {
                    res.send({ msg: "Mail send,Please refer email to activate account" })
                }
            })
        }
        else {
            res.send({ statuscode: 0, msg: "Error while saving data in database" })
        }
    }
})

//view all member api
app.get("/api/viewallmembers", async (req, res) => {
    const result = await registermodel.find()
    if (result.length === 0) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, memberdata: result, arraylength: result.length })
    }
})

//search user
app.get("/api/searchuser", async (req, res) => {
    const result = await registermodel.findOne({ username: req.query.un })
    if (!result) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, mdata: result })
    }
})

//delete member api
app.delete("/api/delmember/:uid", async (req, res) => {
    const result = await registermodel.findOneAndRemove({ _id: req.params.uid })
    if (!result) {
        res.send({ statuscode: 0, msg: "member not deleted" })
    }
    else {
        res.send({ statuscode: 1 })
    }
})

//login api
app.post("/api/login", async (req, res) => {
    const result = await registermodel.findOne({ username: req.body.uname })
    if (!result) {
        res.send({ statuscode: 0 })
    }
    else {
        if(result.isActive===true)
        {
            const hash = result.password
            const compareresult = bcrypt.compareSync(req.body.pass, hash)
            if (compareresult === true) {
                let token = jwt.sign({ data: result._id }, process.env.TOKEN_KEY, { expiresIn: '1h' })
                res.send({ statuscode: 1, memberdata: result, authtoken: token })
            }
            else {
                res.send({ statuscode: 0 })
            }
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

// active account api
app.get("/api/activeacc/:token", async (req, res) => {
    const updateresult = await registermodel.updateOne({ ActivationToken: req.params.token }, { $set: { isActive: true } })
    if (updateresult.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
})

//add categoryapi
app.post("/api/addcategory", verifytoken, upload.single('category_pic'), async (req, res) => {
    if (!req.file) {
        picname = "download.jpeg"
    }
    const newrecord = new collectionmodel({ collectionname: req.body.category_name, collectionpic: picname })
    const result = await newrecord.save()
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//update category
app.put("/api/updatecategory",verifytoken,upload.single('cpic'), async (req, res) => {
    if (!req.file) {
        picname = req.body.oldpic
    }
    else {
        if (req.body.oldpic != "download.jpeg") {
            fs.unlink('public/uploads' + req.body.oldpic, (err) => {
                if (err) {
                    console.log("error occur")
                }
                else {
                    console.log("file is deleted")
                }
            })
        }
    }
    const updateresult = await collectionmodel.updateOne({ _id: req.body.cid }, { $set: { collectionname: req.body.category_name, collectionpic: picname } })
    if (updateresult.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch categories
app.get("/api/fetchcategories", async (req, res) => {
    const result = await collectionmodel.find()
    if (result.length === 0) {
        res.send({ statuscode: 0, msg: "collection not found" })
    }
    else {
        res.send({ statuscode: 1, categorydata: result })
    }
})

//add sub category
const subcategoryschema = new mongoose.Schema({ category_id: String, subcategoryname: String, picture: String }, { versionKey: false })
const subcategorymodel = new mongoose.model("Sub Category", subcategoryschema, "Sub category")

app.post("/api/addsubcategory", upload.single('pic'), async (req, res) => {
    if (!req.file) {
        picname = "download.jpeg"
    }
    const newrecord = new subcategorymodel({ category_id: req.body.category_id, subcategoryname: req.body.subcategoryname, picture: picname })
    const result = await newrecord.save()
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch sub category
app.get("/api/fetchsubcategories", async (req, res) => {
    const result = await subcategorymodel.find({ category_id: req.query.cid })
    if (result.length === 0) {
        res.send({ statuscode: 0, msg: "Sub category not found" })
    }
    else {
        res.send({ statuscode: 1, subcatdata: result })
    }
})

//add product
const addproductschema = new mongoose.Schema({ category_id: String, Subcategory_id: String, Product_name: String, Rate: Number, Discount: Number, Stock: Number, Discription: String, Featured: String, Product_pic: String, Addedon: String }, { versionKey: false })
const addproductmodel = new mongoose.model("Product", addproductschema, "Product")

app.post("/api/addproduct", upload.single('pic'), async (req, res) => {
    if (!req.file) {
        picname = "download.jpeg"
    }
    const newrecord = new addproductmodel({ category_id: req.body.category_id, Subcategory_id: req.body.subcategory_id, Product_name: req.body.productname, Rate: parseInt(req.body.rate), Discount: req.body.discount, Stock: req.body.stock, Discription: req.body.discription, Featured: req.body.featured, Product_pic: picname, Addedon: new Date })

    const result = await newrecord.save()
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//update product
app.put("/api/updateproduct/:pid", upload.single('pic'), async (req, res) => {
    if (!req.file) {
         picname=req.body.oldpic
    }
    else {
        if (req.body.oldpic != "download.jpeg") {
            fs.unlink('public/uploads' + req.body.oldpic, (err) => {
                if (err) {
                    console.log("error occur")
                }
                else {
                    console.log("file is deleted")
                }
            })
            picname=req.body.oldpic
        }
    }
    const updateresult = await addproductmodel.updateOne({ _id: req.params.pid },{ $set: { category_id: req.body.category_id, Subcategory_id: req.body.subcategory_id, Product_name: req.body.productname, Rate: parseInt(req.body.rate), Discount: req.body.discount, Stock: req.body.stock, Discription: req.body.discription, Featured: req.body.featured, Product_pic: picname }})

    if (updateresult.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch sub category by id
app.get("/api/fetchsubcatbyid", async (req, res) => {
    var result = await subcategorymodel.findOne({ _id: req.query.subcatid });
    if (!result) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, subcatdata: result })
    }
})

//update sub category
app.put("/api/updatesubcategory", upload.single('pic'), async (req, res) => {
    if (!req.file) {
        picname = req.body.oldpic
    }
    else {
        if (req.body.oldpic !== "download.jpeg") {
            fs.unlink("public/uploads" + req.body.oldpic, (err) => {
                if (err) {
                    console.log("error occur")
                }
                else {
                    console.log("file is deleted")
                }
            })
        }
    }
    const updateresult = await subcategorymodel.updateOne({ _id: req.body.subcatid }, { $set: { category_id: req.body.category_id, subcategoryname: req.body.subcategoryname, picture: picname } })
    if (updateresult.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch product by subcatid
app.get("/api/fetchprod", async (req, res) => {
    var response = await addproductmodel.find({ Subcategory_id: req.query.scid });
    if (response.length === 0) {
        res.send({ statuscode: 0 })
    }
    else {
        var filter = req.query.filter
        //show  product ascending order api
        if (filter === "ascending") {
            const result = await addproductmodel.find({ Subcategory_id: req.query.scid }).sort({ "Product_name": 1 })
            if (result) {
                res.send({ statuscode: 1, proddata: result })
            }
            else {
                res.send({ statuscode: 0 })
            }
        }
        else if (filter === "lowtohigh") {
            const result = await addproductmodel.find({ Subcategory_id: req.query.scid }).sort({ "Rate": 1 })
            if (result) {
                res.send({ statuscode: 1, proddata: result })
            }
            else {
                res.send({ statuscode: 0 })
            }
        }
        else if (filter === "hightolow") {
            const result = await addproductmodel.find({ Subcategory_id: req.query.scid }).sort({ "Rate": -1 })
            if (result) {
                res.send({ statuscode: 1, proddata: result })
            }
            else {
                res.send({ statuscode: 0 })
            }
        }
        else {
            var result = await addproductmodel.find({ Subcategory_id: req.query.scid });
            if (result.length === 0) {
                res.send({ statuscode: 0 })
            }
            else {
                res.send({ statuscode: 1, proddata: result })
            }
        }
    }
})

//api of fetchproduct by id
app.get("/api/fetchprodbyid/:pid", async (req, res) => {
    var result = await addproductmodel.findOne({ _id: req.params.pid });
    if (!result) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, proddata: result })
    }
})

// change password
app.put("/api/changepassword", async (req, res) => {
    const result = await registermodel.findOne({ username: req.body.uname })
    if (result) {
        var hash = result.password
        const compareresult = bcrypt.compareSync(req.body.pass, hash)
        if (compareresult === true) {
            var hash = bcrypt.hashSync(req.body.newpass, 10)
            result.password = hash
            const updatepass = await result.save()
            if (updatepass) {
                res.send({ statuscode: 1, msg: "Password update succesfull,now login again" })
            }
            else {
                res.send({ statuscode: 0, msg: "Problem occur while update password" })
            }
        }
        else {
            res.send({ statuscode: -1, msg: "Invalid current password" })
        }
    }
})

// Cart APIs

var cartSchema = new mongoose.Schema({ prodid: String, name: String, rate: Number, qty: Number, tcost: Number, prodpic: String, username: String }, { versionKey: false })
// var cartSchema = new mongoose.Schema({ prodid: String, name: String, rate: Number, qty: Number, tcost: Number, prodpic: String, stock: Number, username: String }, { versionKey: false })
const cartModel = mongoose.model('cart', cartSchema, "cart");
//add to cart
app.post("/api/addtocart", async (req, res) => {
    const newrecord = new cartModel({ prodid: req.body.prodid, name: req.body.productname, rate: req.body.prize, qty: req.body.qty, tcost: req.body.totalcost, prodpic: req.body.picname, stock: req.body.stock, username: req.body.uname })

    const result = await newrecord.save()
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch cart
app.get("/api/fetchcart/:uname", async (req, res) => {
    const result = await cartModel.find({ username: req.params.uname })
    if (result.length === 0) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, cartdata: result, arraylength: result.length })
    }
})

//update cart
app.put("/api/updatecart", async (req, res) => {
    const findresult = await cartModel.findOne({ prodid: req.body.prodid })
    if (findresult) {
        var Quantity = findresult.qty
        var amt = Quantity * req.body.prize
        var totalqty = parseInt(Quantity) + parseInt(req.body.qty)
        var totalcost = parseInt(req.body.totalcost) + parseInt(amt)
        // var stock = findresult.stock
        // var availablestock = parseInt(stock) - parseInt(totalqty)

        // const updatecart = await cartModel.updateOne({ prodid: req.body.prodid }, { $set: { qty: totalqty, tcost: totalcost, stock: availablestock } })
        const updatecart = await cartModel.updateOne({ prodid: req.body.prodid }, { $set: { qty: totalqty, tcost: totalcost } })
        if (updatecart.modifiedCount === 1) {
            res.send({ statuscode: 1, msg: "cart quantity update" })
        }
        else {
            res.send({ statuscode: 0 })
        }
    }
})

//check cart api 
app.get("/api/checkcart", async (req, res) => {
    const findresult1 = await cartModel.findOne({ username: req.query.uname })
    console.log(findresult1)
    if (findresult1) {
        const findresult2 = await cartModel.findOne({ prodid: req.query.prodid })
        console.log(findresult2)
        if (findresult2) {
            if (findresult2.prodid === req.query.prodid) {
                res.send({ msg: "product already exists", statuscode: 2 })
            }
        }
        else {
            res.send({ statuscode: 3 })
        }
    }
    else {
        res.send({ statuscode: 3, msg: "user not find" })
    }
})

//delete cart
app.delete("/api/delcart/:id", async (req, res) => {
    const result = await cartModel.findByIdAndRemove({ _id: req.params.id })
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//checkout/order APIs
var orderSchema = new mongoose.Schema({ address: String, orderamt: Number, pmode: String, username: String, OrderDate: String, carddetails: Object, status: String, items: [Object] }, { versionKey: false })

const orderModel = mongoose.model('Orders', orderSchema, "Orders");

//api saveorder //update stock
app.post("/api/saveorder", async (req, res) => {
    var orderdt = new Date();
    var newrecord = new orderModel({ address: req.body.address, orderamt: req.body.orderamt, pmode: req.body.pmode, username: req.body.uname, OrderDate: orderdt, carddetails: req.body.carddetails, status: req.body.status, items: req.body.cartdata });

    var result = await newrecord.save();
    if (result) {
        const updatelist = req.body.cartdata
        for (var i = 0; i < updatelist.length; i++) {
            var updateresult = await addproductmodel.updateOne({ _id: updatelist[i].prodid }, { $inc: { "Stock": -updatelist[i].qty } })
        }
        if (updateresult.modifiedCount === 1) {
            var emptycart = await cartModel.deleteMany({ username: req.body.uname })
            if (emptycart.deletedCount >= 1) {
                res.send({ statuscode: 1 })
            }
            else {
                res.send({ statuscode: -2 })
            }
        }
        else {
            res.send({ statuscode: -1 })
        }
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//view orders
app.get("/api/fetchorders", async (req, res) => {
    const result = await orderModel.find().sort({ "OrderDate": -1 })
    if (result.length === 0) {
        res.send({ statuscode: 0, msg: "order not found" })
    }
    else {
        res.send({ statuscode: 1, orderdata: result })
    }
})

//fetch orderitems
app.get("/api/fetchordersitems/:oid", async (req, res) => {
    var result = await orderModel.findOne({ _id: req.params.oid });
    if (!result) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, orderitems: result.items })
    }
})
//search product api
app.get("/api/searchprod/:term", async (req, res) => {
    var result = await addproductmodel.find({ Product_name: { $regex: ".*" + req.params.term, $options: "i" } });
    if (!result) {
        res.send({ statuscode: 0 })
    }
    else {
        res.send({ statuscode: 1, proddata: result })
    }
})

//show latest product api
app.get("/api/latestprod", async (req, res) => {
    const result = await addproductmodel.find().sort({ "Addedon": -1 }).limit(9)
    if (result) {
        res.send({ statuscode: 1, proddata: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})
//show featured product
app.get("/api/featuredprod", async (req, res) => {
    const result = await addproductmodel.find({ Featured: "yes" }).limit(9)
    if (result) {
        res.send({ statuscode: 1, proddata: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch order no. api
app.get("/api/fetchorderno/:un", async (req, res) => {
    const result = await orderModel.findOne({ username: req.params.un }).sort({ "OrderDate": -1 })
    // console.log(result)
    if (result) {
        res.send({ statuscode: 1, orderdata: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//update status api
app.put("/api/updatestatus", async (req, res) => {
    const result = await orderModel.updateOne({ _id: req.body.orderid }, { $set: { status: req.body.updatestatus } })
    if (result.modifiedCount === 1) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//fetch orders 
app.get("/api/fetchmyorders/:un", async (req, res) => {
    const result = await orderModel.find({ username: req.params.un }).sort({ "OrderDate": -1 })
    if (result) {
        res.send({ statuscode: 1, orderdata: result })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//api for sub category delete
app.delete("/api/deletesubcategories/:subcatid", async (req, res) => {
    const result = await subcategorymodel.findByIdAndRemove({ _id: req.params.subcatid })
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//api for product delete
app.delete("/api/deleteproduct/:pid", async (req, res) => {
    const result = await addproductmodel.findByIdAndRemove({ _id: req.params.pid })
    if (result) {
        res.send({ statuscode: 1 })
    }
    else {
        res.send({ statuscode: 0 })
    }
})

//smtp contactus api
app.post("/api/contactus", async (req, res) => {
    const MailOptions = {
        from: "ecomapp@outlook.com",
        to: "upasanajohar30@gmail.com",
        subject: "Message from website(contactUs)",
        text: `Name:-${req.body.name}\nPhone:-${req.body.phn}\nEmail_id:-${req.body.email}\nMesssage:-${req.body.msg}`
    }
    transporter.sendMail(MailOptions, (error, info) => {
        if (error) {
            res.send({ msg: "error while sending mail" })
        }
        else {
            res.send({ msg: "Message sent successfully" })
        }
    })
})

//reset password model
const resetschema = new mongoose.Schema({ username: String, token: String, expTime: String }, { versionKey: false })
const resetModel = mongoose.model("reset password", resetschema, "reset password")
//api forgot password
app.get("/api/forgotpassword/:un", async (req, res) => {
    const result = await registermodel.findOne({ username: req.params.un })
    if(!result)
    {
        res.send({msg:"Invalid email"})
    }
    else
    {
        var name = result.pname
        if (result) {
            const token = uuid.v4()
            const currentTym = new Date()
            const futureTime = new Date(currentTym.getTime() + 15 * 60000)
            const reset = new resetModel({ username: req.params.un, token: token, expTime: futureTime })
            const result = await reset.save()
            if (result) {
                var resetLink = `http://localhost:3000/resetpassword?token=${token}`
                const MailOptions = {
                    to: req.params.un,
                    from: "ecomapp@outlook.com",
                    subject: "Reset password from Shopping Plaza.com",
                    text: `Hello ${name}\n\nPlease click on the following link to reset password\n\n
                    ${resetLink}`
    
                }
                transporter.sendMail(MailOptions, (error, succ) => {
                    if (error) {
                        res.send({ msg: "Error while send Email" })
                    }
                    else {
                        res.send({ msg: "Please refer Email to reset password" })
                    }
                })
            }
            else {
                res.send({ msg: "error while saving data in reset document" })
            }
        }
        else {
            res.send({ msg: "please input correct email" })
        }
    } 
 })
   
//check reset link validate
app.get("/api/chklinkvalidate", async (req, res) => {
    const result = await resetModel.findOne({ token: req.query.token })
    if (result) {
        var currentTime = new Date()
        var ExpireTime = new Date(result.expTime)
        if (ExpireTime > currentTime) {
            res.send({ statuscode: 1, username: result.username })
        }
        else {
            res.send({ msg: "Link is expired" })
        }
    }
    else {
        res.send({ msg: "invalid token" })
    }
})

//reset password api 
app.put("/api/resetpassword", async (req, res) => {
    const result = await registermodel.findOne({ username: req.query.un })
    if (result) {
        var password = req.query.pass
        const hash = bcrypt.hashSync(password, 10)
        const updateresult = await registermodel.updateOne({ username: req.query.un }, { $set: { password: hash } })
        if (updateresult.modifiedCount === 1) {
            res.send({ msg: "Password reset successfull" })
        }
    }
    else {
        res.send({ msg: "problem occur while find username,try again" })
    }
})