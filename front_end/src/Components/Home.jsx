import React, { useEffect, useState } from 'react'
import SignUpPage from './SingUp';
import { Link } from 'react-router-dom';


const Home = () => {
   
  return (
    <div>
      <div>
      <h2>Sign Up</h2>
     
      </div>


     <SignUpPage />
     <div style={{"display": "flex","justifyContent":"center","alignItems":"center","padding":"20px"}}>
      <p style={{"padding":"20px"}}>If you already registered waiting for verify</p>

     <Link to="/verify">verify</Link>
     </div>
  
    </div>
  )
}

export default Home