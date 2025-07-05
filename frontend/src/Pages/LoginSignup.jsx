import React, { useState, useContext } from 'react';
import './CSS/LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { signInWithGoogle } from '../firebase';
import googleIcon from '../Assets/google-icon.png';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, handleLogin, handleLogout } = useContext(ShopContext);

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError("");
  }

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('https://e-commerce-8j0j.onrender.com/login', {
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
        handleLogin(data.token);
        navigate('/');
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('https://e-commerce-8j0j.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        handleLogin(data.token);
        navigate('/');
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
      
      const response = await fetch('https://e-commerce-8j0j.onrender.com/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: await user.getIdToken(),
          email: user.email,
          name: user.displayName
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        handleLogin(data.token);
        navigate('/');
      } else {
        setError(data.error || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    handleLogout();
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
        
        <button 
          onClick={handleGoogleSignIn}
          className="google-signin-btn"
          disabled={loading}
        >
          <img src={googleIcon} alt="Google" className="google-icon" />
          Continue with Google
        </button>
        
        <div className="login-signup-divider">
          <span>or</span>
        </div>
        
        <div className="login-signup-fields">
          {state === "Sign Up" && (
            <input 
              type="text" 
              name='username' 
              value={formData.username} 
              onChange={changeHandler} 
              placeholder='Enter Name'
              required
            />
          )}
          <input 
            name='email' 
            value={formData.email} 
            onChange={changeHandler} 
            type="email" 
            placeholder='Enter Email'
            required 
          />
          <input 
            name='password' 
            value={formData.password} 
            onChange={changeHandler} 
            type="password" 
            placeholder='Enter Password'
            required 
            minLength="6"
          />
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <button 
          onClick={() => state === "Login" ? login() : signUp()}
          disabled={loading}
          className="login-signup-button"
        >
          {loading ? 'Processing...' : 'Continue'}
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
          <input type="checkbox" name="agree" id="agree" required />
          <label htmlFor="agree">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;