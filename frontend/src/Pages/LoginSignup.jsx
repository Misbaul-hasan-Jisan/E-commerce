import React, { useState, useContext } from 'react';
import './CSS/LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; // Adjust the import path as needed

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const navigate = useNavigate();
  
  // Use the context for authentication state
  const { isLoggedIn, handleLogin, handleLogout } = useContext(ShopContext);

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        handleLogin(data.token); // Use context's handleLogin instead of local state
        navigate('/');
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  const signUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        handleLogin(data.token); // Use context's handleLogin
        navigate('/');
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup");
    }
  };

  const logout = () => {
    handleLogout(); // Use context's handleLogout
    navigate('/login');
  };

  if (isLoggedIn) {
    return (
      <div className='login-signup'>
        <div className="login-signup-container">
          <h1>You are already logged in</h1>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className='login-signup'>
      <div className="login-signup-container">
        <h1>{state}</h1>
        <div className="login-signup-fields">
          {state === "Sign Up" && (
            <input 
              type="text" 
              name='username' 
              value={formData.username} 
              onChange={changeHandler} 
              placeholder='Enter Name'
            />
          )}
          <input 
            name='email' 
            value={formData.email} 
            onChange={changeHandler} 
            type="email" 
            placeholder='Enter Email' 
          />
          <input 
            name='password' 
            value={formData.password} 
            onChange={changeHandler} 
            type="password" 
            placeholder='Enter Password' 
          />
        </div>
        <button onClick={() => state === "Login" ? login() : signUp()}>
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className='login-signup-login'>
            Already have an account? 
            <span onClick={() => setState('Login')}> Login here</span>
          </p>
        ) : (
          <p className='login-signup-login'>
            Create an account 
            <span onClick={() => setState('Sign Up')}> Click here</span>
          </p>
        )}
        
        <div className="login-signup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;