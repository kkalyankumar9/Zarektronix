import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './Home'


import SignUpPage from './SingUp'
import VerifySignUp from './VerifySignup'



const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/verify' element={<VerifySignUp/>}/>
    </Routes>
  )
}

export default AllRoutes