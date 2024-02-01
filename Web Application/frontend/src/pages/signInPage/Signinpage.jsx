// import "./signinPage.css";
import React, { useState } from 'react';
import { FirstNavBar } from "../../components/firstNavBar/FirstNavBar";
import { header, suredes, right, inputdiv, checkboxWrapper, checkboxInput, checkboxLabel, 
          beforeButton, forgetPass, button, split, centered, left, input,
          inputValidationContainer, labelStyle, descriptionStyle, invalidSignin } from "./SigninPageStyle"; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import mockData from '../../data/mock_data.json'
import backgroundImage from '../../asserts/SignInPageBackground.png';

const Signin = () => {
// HOVER BUTTON FUNCTIONALITY
const [buttonHover, setButtonHover] = useState(false);
const handleForgotPasswordClick = () => {
  navigate('/forgotpassword');
};
const handleMouseEnter = () => {
  setButtonHover(true);
};

const handleMouseLeave = () => {
  setButtonHover(false);
};

// INPUT VALIDATION
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const navigate = useNavigate();
const [invalidLogin, setInvalidLogin] = useState(false);
const [error, setError] = useState({
  email: false,
  password: false,
});

const handleSubmit = async (e) => {
  e.preventDefault();
  localStorage.removeItem('userInfo');

  const newErrors = {
    email: email.trim() === '',
    password: password.trim() === '',
  };

  setError(newErrors);

  if (Object.values(newErrors).some((error) => error)) {
    return;
  }

  try {
    // Send the login data to the backend API
    const response = await axios.post('http://localhost:8000/users/signin', {
      email,
      password,
    });

    if (response.status === 200) {
      // If login is successful, navigate to the homepage
      navigate('/homepage', { state: { email: email } });
    } else {
      // Show an error message or perform any other action for invalid login
      console.log('Invalid email or password');
      setInvalidLogin(true);
    }
  } catch (error) {
    // Handle errors, e.g., show an error message to the user
    console.error('Error signing in:', error);
    setInvalidLogin(true);
  }
};

return (
  <div
  style={{
    backgroundImage: `url(${backgroundImage})`, // Set the background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh', 
  }}>
    <div style={{...split, ...left}}>
      <div style={centered}>
        <div style={descriptionStyle}>
          <h1 style={header}>WELCOME TO SuRe !</h1>
          <p style={suredes}>SuRe is a platform for Retailers to manage its invoices and SOA.</p>
        </div>
      </div>
    </div>

    <div style={{...split, ...right}}>
      <div style={centered}>
        <FirstNavBar />


        <div style={inputdiv}>
          <form onSubmit={handleSubmit}>
            <div style={inputValidationContainer}>
              <input
                style={input}
                type="email"
                name="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default behavior
                    handleSubmit(e); // Manually trigger form submission
                  }
                }}
              />
              {error.email ? <label style={labelStyle}>This is a required field.</label> : null}
            </div>

            <div style={inputValidationContainer}>
              <input
                style={input}
                type="password"
                name="password"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default behavior
                    handleSubmit(e); // Manually trigger form submission
                  }
                }}
              />
              {error.password ? <label style={labelStyle}>This is a required field.</label> : null}
            </div>

            <div style={beforeButton}>
              <div style={checkboxWrapper}>
                <input type="checkbox" id="remember_me" style={checkboxInput}/>
                <label htmlFor="remember_me" style={checkboxLabel}>Remember Me?</label>
              </div>
              <p>
              <button style={forgetPass} onClick={handleForgotPasswordClick}>
              Forgot Password?
              </button>

              </p>
            </div>

            <div>
              <button name="loginSubmitButton"
                style={{
                  ...button,
                  backgroundColor: buttonHover ? '#A1A1A1' : '#FFF',
                  color: buttonHover ? '#FFF' : 'rgba(71, 71, 71, 0.80)',
                }}
                type="submit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleSubmit}
              >
                Sign In
              </button>
              {invalidLogin && <p name="error" style={invalidSignin}>Invalid email or password. Please try again.</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Signin;