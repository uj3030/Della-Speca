import { Routes ,Route, Navigate} from "react-router"
import Signup from "./signup"
import Login from "./login"
import Home from "./homepage"
import Viewmember from "./viewmember"
import Searchuser from "./searchuser"
import Categorymanage from "./categorymanage"
import Subcategorymanage from "./subcategorymanage"
import Productmanage from "./productmanage"
import Updatesubcategory from "./updatesubcat"
import Showcategory from "./showcategory"
import Showsubcategory from "./showsubcategory"
import Showproduct from "./showproduct"
import Productdetail from "./productdetail"
import Updateproduct from "./updateproduct"
import Changepassword from "./changepassword"
import Showcart from "./showcart"
import Checkout from "./checkout"
import Ordersummarry from "./ordersummary"
import Searchproduct from "./searchproduct"
import Adminhomepage from "./Adminhomeage"
import Adminsignup from "./adminsignup"
import UserRoutesProtection from "./userroutesprotection"
import AdminRoutesProtection from "./adminroutesprotection"
import Vieworders from "./vieworders"
import Orderproducts from "./orderproducts"
import Updatestatus from "./updatestatus"
import Myorders from "./myorders"
import Contactus from "./contactus"
import Forgotpassword from "./forgotpassword"
import ResetPassword from "./resetpassword"

const Siteroute=()=>
{
    return(
    <>
    <Routes>
        <Route path="/" element={<Navigate to="/homepage"/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/categorymanage" element={<AdminRoutesProtection mycomp={Categorymanage}/>}></Route>
        <Route path="/subcategorymanage" element={<AdminRoutesProtection mycomp={Subcategorymanage}/>}></Route>
        <Route path="/updatesubcat" element={<AdminRoutesProtection mycomp={Updatesubcategory}/>}></Route>           
        <Route path="/updateproduct" element={<AdminRoutesProtection mycomp={Updateproduct}/>}></Route>           
        <Route path="/productmanage" element={<AdminRoutesProtection mycomp={Productmanage}/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/forgotpassword" element={<Forgotpassword/>}></Route>
        <Route path="/resetpassword" element={<ResetPassword/>}></Route>
        <Route path="/checkout" element={<UserRoutesProtection mycomp={Checkout}/>}></Route>
        <Route path="/cart" element={<UserRoutesProtection mycomp={Showcart}/>}></Route>
        <Route path="/ordersummary" element={<UserRoutesProtection mycomp={Ordersummarry}/>}></Route>
        <Route path="/changepassword" element={<UserRoutesProtection mycomp={Changepassword}/>}></Route>
        <Route path="/showsubcategories" element={<Showsubcategory/>}></Route>
        <Route path="/showcategory" element={<Showcategory/>}></Route>
        <Route path="/homepage" element={<Home/>}></Route>
        <Route path="/product" element={<Showproduct/>}></Route> 
        <Route path="/myorders" element={<UserRoutesProtection mycomp={Myorders}/>}></Route> 
        <Route path="/productdetail" element={<Productdetail/>}></Route>
        <Route path="/orderproducts" element={<Orderproducts/>}></Route>
        <Route path="/updatestatus" element={<Updatestatus/>}></Route>
        <Route path="/contactus" element={<Contactus/>}></Route>
        <Route path="/activateaccount" element={<Login/>}></Route>
        <Route path="/viewmember" element={<AdminRoutesProtection mycomp={Viewmember}/>}></Route>
        <Route path="/adminhomepage" element={<Adminhomepage/>}></Route>
        <Route path="/createadmin" element={<AdminRoutesProtection mycomp={Adminsignup}/>}></Route>
        <Route path="/searchuser" element={<AdminRoutesProtection mycomp={Searchuser}/>}></Route>
        <Route path="/vieworders" element={<AdminRoutesProtection mycomp={Vieworders}/>}></Route>
        <Route path="/searchproducts" element={<Searchproduct/>}></Route>
        <Route path="/*" element={<h2>Page not found</h2>}></Route>
    </Routes>
    </>
    )
}
export default Siteroute