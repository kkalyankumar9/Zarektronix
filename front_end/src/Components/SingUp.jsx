import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Css/signup.css';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const offlineSignupData = JSON.parse(localStorage.getItem('offlineSignup')) || { name: '', email: '', password: '' };
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.{8,})/.test(password);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (isOnline) {
        if (name && email && password) {
          if (validatePassword(password)) {
            const response = await axios.post('https://zarektronix-server.onrender.com/users/signup', {
              name,
              email,
              password,
            });

            if (response.status === 200) {
              toast.success('Signup Successful');
              navigate('/verify');
              setName('');
              setEmail('');
              setPassword('');
              localStorage.removeItem('offlineSignup');
            }
          } else {
            toast.error('Password must meet the specified criteria');
          }
        } else {
          toast.error('All fields are required');
        }
      } else {
        // Store data in local storage only when offline
        localStorage.setItem('offlineSignup', JSON.stringify({ name, email, password }));
        toast.info('Signup data stored locally. It will be submitted when online.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          toast.error('User already signed up');
        } else if (status === 500) {
          toast.error('Internal server error. Please try again later.');
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    }
  };

  // Submit offline data when back online
  useEffect(() => {
    const submitOfflineData = async () => {
      if (isOnline && offlineSignupData && validatePassword(offlineSignupData.password)) {
        try {
          const response = await axios.post('https://zarektronix-server.onrender.com/users/signup', offlineSignupData);

          if (response.status === 200) {
            toast.success('Signup Successful');
            navigate('/verify');
            localStorage.removeItem('offlineSignup');
          }
        } catch (error) {
          console.error('Error during offline signup submission:', error.message);
          toast.error('Error submitting offline signup. Please try again.');
        }
      }
    };

    submitOfflineData();
  }, [isOnline, offlineSignupData, navigate]);

  return (
    <div className="signup-container">
      <div>
        {isOnline ? (
          <div className="circle green" title="Online"></div>
        ) : (
          <div className="circle red" title="Offline"></div>
        )}
      </div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Signup</button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
