const { createSlice } = require("@reduxjs/toolkit");
const initialState={
    LoggedIn:false,
    PersonName:"Guest",
    usertype:"",
    username:""
}
const userslice=createSlice({
    name:"userslice",
    initialState,
    reducers:{
        login(state,action)
        {
            state.LoggedIn=true
            state.PersonName=action.payload.pname
            state.usertype=action.payload.usertype
            state.username=action.payload.username
        },
        logout(state)
        {
            state.LoggedIn=false
            state.PersonName="Guest"
            state.usertype=""
            state.username=""
        }
    }
})
export const {login,logout}=userslice.actions
export default userslice.reducer