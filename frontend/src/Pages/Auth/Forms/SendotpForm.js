import React, { useState } from 'react';
import { TextField, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const SendOTPForm = ({ email, setEmail, backendUrl, setOtpSent }) => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/auth/forgetpassword`, { email });
      if (res.data.success) {
        toast.success('OTP sent to your email');
        setOtpSent(true);
      } else {
        toast.error(res.data.error || res.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <TextField
        variant="outlined"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        error={email.length > 0 && !/\S+@\S+\.\S+/.test(email)}
        helperText={email.length > 0 && !/\S+@\S+\.\S+/.test(email) ? 'Invalid email address' : ''}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{
          margin: '24px 0px 16px',
          backgroundColor: '#6200ea',
          position: 'relative',
        }}
        disabled={loading}
      >
        {loading && (
          <LinearProgress
            style={{
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
            }}
          />
        )}
        {!loading && 'Send OTP'}
      </Button>
    </form>
  );
};

export default SendOTPForm;
