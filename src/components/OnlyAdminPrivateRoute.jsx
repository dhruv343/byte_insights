import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function OnlyAdminPrivateRoute() {
    const {currentUser}=useSelector((state)=>state.user)
    return  currentUser && currentUser.user.isAdmin ? <Outlet/>:(<Navigate to="/signin"/>)
}

export default OnlyAdminPrivateRoute