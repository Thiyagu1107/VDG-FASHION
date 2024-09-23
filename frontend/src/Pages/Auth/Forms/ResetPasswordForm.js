import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = ({ email, otp, newPassword, setOtp, setNewPassword, backendUrl }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error('OTP and New Password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/auth/resetpassword`, { email, otp, newPassword });
      if (res.data.success) {  
      toast.success(res.data.message);
       setTimeout(() => {
        navigate('/login');
      }, 500); 
      } else {
        toast.error(res.data.error || res.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post(`${backendUrl}/auth/forgetpassword`, { email });
      if (res.data.success) {
        toast.success('OTP resent to your email');
      } else {
        toast.error(res.data.error || res.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <TextField
        variant="outlined"
        required
        fullWidth
        name="otp"
        label="Enter OTP"
        type="text"
        id="otp"
        inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        autoComplete="off"
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="text"
                color="primary"
                onClick={handleResendOTP}
              >
                Resend 
              </Button>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="newPassword"
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={loading}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ margin: '24px 0px 16px' }}
        disabled={loading}
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
