import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

import backgroundImage from '../../asserts/ForgetPasswordPage.jpg';

import {
  resetPasswordContainerStyle,
  resetFormStyle,
  resetPasswordFormContainer,
  forgetPasswordText,
  keyNewPasswordText,
  forgotPasswordInputStyle, 
  forgetPasswordButtonStyle,
} from './forgotpasswordpagestyle'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Sending password reset request...');
      // Send a POST request to your backend API to initiate password reset
      await axios.post('http://localhost:8000/users/forgotpassword', { email });

      console.log('Password reset request successful.');
      // Set the isSent state to true upon successful request
      setIsSent(true);
    } catch (error) {
      console.error('Error sending password reset request:', error);
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`, // Set the background image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
    }}>
      <div>

        <div style={resetPasswordContainerStyle}>
          <h1 style={resetFormStyle}>RESET PASSWORD FORM</h1>
          <div style={resetPasswordFormContainer}>
            <h2 style={forgetPasswordText}>Forgot Password?</h2>
            <p style={keyNewPasswordText}>We will send to you a link in you email to reset your password.</p>

            <input style={forgotPasswordInputStyle} placeholder="Enter Your Email Address."></input>

            <Link to="/signinpage">
            <button style={forgetPasswordButtonStyle} onClick={handleSubmit}>Send</button>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
