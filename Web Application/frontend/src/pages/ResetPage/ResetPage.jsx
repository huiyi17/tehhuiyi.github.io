import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library
import { useLocation } from 'react-router-dom';
//import { use } from '../../../../backend/routes/userRouter';

const ResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      console.log('Token:', token);
    } else {
      console.log('Token not found in URL query.');
    }
  }, [location.search]);

  const handleResetPassword = async () => {
    console.log('Reset button clicked');
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/users/resetpassword',
        { token, newPassword }, // Send token and newPassword in the request body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };
  return (
    <div>
      <h2>Reset Password</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPage;