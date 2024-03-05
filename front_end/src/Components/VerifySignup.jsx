import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Css/verifysignup.css";
import { useNavigate } from 'react-router-dom';
const VerifySignUp = () => {
  const [verifycode, setVerifycode] = useState("");
const navigate=useNavigate()
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`https://zarektronix-server.onrender.com/users/verify?verifycode=${verifycode}`);
      console.log(response.data);

      if (response.status === 200) {
        toast.success("Verification successful");
        navigate("/")
      } else {
        toast.error(`Verification failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during verification:", error.message);
      // Handle other error messages
      if (error.response) {
        toast.error(`Server responded with error status: ${error.response.status}`);
      } else if (error.request) {
        toast.error("No response received from the server");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  const handleBaack=()=>{
    navigate(-1)
  }
  return (
    <div>
      <h2> Signup Verify </h2> 
      <form action="" onSubmit={handleVerify} className='verify-signup-container'  >
        <input type="text" value={verifycode} onChange={(e) => setVerifycode(e.target.value)} />
        <button type='submit'>Verify</button>
      </form>
      <button onClick={handleBaack}>back</button>
      <ToastContainer />
    </div>
  );
};

export default VerifySignUp;
