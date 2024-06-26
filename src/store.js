import { configureStore } from "@reduxjs/toolkit";
import userslice from "./Reducer/userslice";

const mystore=configureStore({
    reducer:{
        userslice:userslice
    }
})
export default mystore