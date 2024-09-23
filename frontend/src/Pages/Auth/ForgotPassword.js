import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../Assets/VDG Fshion.png";
import SendOTPForm from './Forms/SendotpForm';
import ResetPasswordForm from './Forms/ResetPasswordForm';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  return (
    <div style={{ backgroundColor: 'rgb(238, 242, 246)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="xs">
      <ToastContainer />
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={logo} alt="logo" style={{ width: 200, height: 'auto', marginBottom: 20, color: '#6200ea' }} />
        <Typography
          component="h1"
          variant="h5"
          style={{
            margin: '0px 0px 0.35em',
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            lineHeight: 1.2,
            color: 'rgb(103, 58, 183)',
      }}
    >
      Forgot password?
    </Typography>
    <Typography
      component="h2"
      variant="subtitle1"
      style={{
        margin: 0,
        color: 'rgb(105, 117, 134)',
        fontWeight: 400,
        fontFamily: 'Roboto, sans-serif',
        lineHeight: 1.66,
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '20px', // Adjusted to be consistent with the inline style provided
      }}
    >
          {otpSent ? 'Enter OTP and new password' : 'Reset password for login'}
        </Typography>
        {!otpSent ? (
          <SendOTPForm email={email} setEmail={setEmail} backendUrl={backendUrl} setOtpSent={setOtpSent} />
        ) : (
          <ResetPasswordForm
            email={email}
            otp={otp}
            newPassword={newPassword}
            setOtp={setOtp}
            setNewPassword={setNewPassword}
            backendUrl={backendUrl}
          />
        )}
      </div>
      </div>
    </Container>
    </div>
  );
};

export default ForgotPassword;
