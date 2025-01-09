import React, { useEffect,useState } from 'react';
import './registerPage.css';
import { FirstNavBar } from '../../components/firstNavBar/FirstNavBar';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../asserts/RegisterPageBackground.png';

import axios from 'axios';

import {
  header,
  suredes,
  input,
  inputdiv,
  button,
  descriptionStyle,
  inputValidationContainer,
  labelStyle,
  split,
  left,
  right,
  centered,
  successfulRegisterStyle,
  hintStyle
  
} from './RegisterPageStyle';

const RegisterPage = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000); // Adjust the time (in milliseconds) as per your requirement
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // HOVER BUTTON FUNCTIONALITY
  const [buttonHover, setButtonHover] = useState(false);

  const handleMouseEnter = () => {
    setButtonHover(true);
  };

  const handleMouseLeave = () => {
    setButtonHover(false);
  };

  // INPUT VALIDATION
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [error, setError] = useState({
    fullName: false,
    companyName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+$/;

  const getFieldHint = (fieldName) => {
    if (fieldName === 'fullName') {
      return 'You can use letters';
    } if (fieldName === 'email') {
      return 'You can use letters & numbers';
    } if (fieldName === 'password') {
      return 'Minimum 8 characters';
    }
    return '';
  };


  const navigate = useNavigate();

  const resetForm = () => {
    // Reset all the form fields to empty strings
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    // Reset the error object to all false
    setError({
      fullName: false,
      companyName: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: fullName.trim() === '',
      companyName: companyName.trim() === '',
      email: email.trim() === '',
      password: password.trim() === '',
      confirmPassword: confirmPassword.trim() === '',
    };

    if (confirmPassword.trim() !== '' && confirmPassword !== password) {
      newErrors.confirmPassword = true;
    }

    setError(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const userData = {
      name: fullName,
      company: companyName,
      email,
      password,
    };

    axios
    .post('http://localhost:8000/users/register', userData)
    .then((response) => {
      console.log('User registered:', response.data);
      setShowSuccessMessage(true);
      resetForm(); // Reset the form after successful registration
      // navigate('/signinPage', { state: { email: email } });
    })
    .catch((error) => {
      console.error('Error registering user:', error);
      setError({ ...error, serverError: true });
    });

  };
      
  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`, // Set the background image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
    }}>
      <div style={{ ...split, ...left }}>
        <div style={centered}>
          <div style={descriptionStyle}>
            <h1 style={header}>WELCOME TO SuRe !</h1>
            <p style={suredes}>SuRe is a platform for Retailers to manage its invoices and SOA.</p>
          </div>
        </div>
      </div>
  
        <div style={{ ...split, ...right }}>
          <div style={centered}>

          <FirstNavBar />

          <div style={inputdiv}>
            <form onSubmit={handleSubmit}>
              <div style={inputValidationContainer}>
                <input
                  style={input}
                  type="text"
                  name="fullName"
                  value={fullName}
                  placeholder="Enter Your Full Name"
                  onChange={(e) => setFullName(e.target.value)}
                />
                {error.fullName ? (
                    <label style={labelStyle}>
                      {fullName.trim() === '' ? 'This is a required field.' : 'Only letters allowed.'}
                    </label>
                  ) : <label style={hintStyle}>{getFieldHint('fullName')}</label>}
                </div>

              <div style={inputValidationContainer}>
                <input
                  style={input}
                  type="text"
                  name="company"
                  value={companyName}
                  placeholder="Enter Your Company"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                {error.companyName ? <label style={labelStyle}>This is a required field.</label> : null}
                </div>

              <div style={inputValidationContainer}>
                <input
                  style={input}
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.email ? (
                    <label style={labelStyle}>
                      {email.trim() === '' ? 'This is a required field.' : 'Only letters and.'}
                    </label>
                  ) : <label style={hintStyle}>{getFieldHint('email')}</label>}
                </div>

              <div style={inputValidationContainer}>
                <input
                  style={input}
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Enter Your Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error.password ? (
                    <label style={labelStyle}>
                      {password.trim() === '' ? 'This is a required field.' : 'Minimum 8 characters'}
                    </label>
                  ) : <label style={hintStyle}>{getFieldHint('password')}</label>}
                </div>

              <div style={inputValidationContainer}>
                <input
                  style={input}
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm Your Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                 {error.confirmPassword
                    ? confirmPassword.trim() !== ''
                      ? <label style={labelStyle}>Passwords mismatch.</label>
                      : <label style={labelStyle}>This is a required field.</label>
                    : null}
                </div>                
                
                <button
                  style={{
                    ...button,
                    backgroundColor: buttonHover ? '#A1A1A1' : '#FFF',
                    color: buttonHover ? '#FFF' : 'rgba(71, 71, 71, 0.80)',
                  }}
                  type="submit"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Create Account
                </button>
              {showSuccessMessage && (
                  <div style={successfulRegisterStyle}>
                    <p>Account registered!</p>
                  </div>
                )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );

              };

export default RegisterPage;