import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Link,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from "../../Assets/VDG Fshion.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loadingVerifyEmail, setLoadingVerifyEmail] = useState(false); // State for loading Verify Email button
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    calculatePasswordStrength(value);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    // Minimum length check
    if (password.length >= 6) {
      strength += 10;
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      strength += 30;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      strength += 30;
    }

    // Check for digits
    if (/[0-9]/.test(password)) {
      strength += 30;
    }

    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 30;
    }

    strength = Math.min(strength, 100);

    setPasswordStrength(strength);
  };

  const getPasswordStrengthCategory = () => {
    const strength = passwordStrength;

    if (strength === 0) {
      return { label: 'Weak', color: 'red' };
    } else if (strength < 40) {
      return { label: 'Average', color: 'orange' };
    } else if (strength < 80) {
      return { label: 'Good', color: 'yellowgreen' };
    } else {
      return { label: 'Strong', color: 'green' };
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleVerifyEmail = async () => {
    if (email.length === 0 || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email address');
      return;
    }

    setLoadingVerifyEmail(true); // Start loading

    try {
      const res = await axios.post(`${backendUrl}/auth/registerotp`, { email });
      if (res.data.success) {
        toast.success(res.data.message);
        setEmailVerified(true);
        setShowOtpInput(true); 
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoadingVerifyEmail(false); // Stop loading
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/auth/register`, { name, email, password, otp });
      if (res.data.success) {
        toast.success(res.data.message);    
        setTimeout(() => {
          navigate("/");
        }, 500); 
      } else {
        toast.error(res.data.error || res.data.message );
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Network error. Please try again.');
      }
    }
  };

  return (
     <div style={{ backgroundColor: 'rgb(238, 242, 246)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <Container maxWidth="xs">
      <ToastContainer />

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
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
            Sign up
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
              marginBottom: '20px',
            }}
          >
            Enter your credentials to continue
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Name"
              label=" Name"
              name="Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email.length > 0 && !/\S+@\S+\.\S+/.test(email)}
              helperText={email.length > 0 && !/\S+@\S+\.\S+/.test(email) ? 'Invalid email address' : ''}
            />
            {email.length > 0 && !/\S+@\S+\.\S+/.test(email) ? null : (
              !emailVerified && (
                <Button
                  variant="text"
                  color="primary"
                  style={{ marginLeft: '60%'}}
                  onClick={handleVerifyEmail}
                >
                  {loadingVerifyEmail ? <CircularProgress size={24} /> : 'Verify Email'}
                </Button>
              )
            )}
            {showOtpInput && (
              <>
             <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                type="text"
                autoComplete="off"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleVerifyEmail}
                      >
                        Resend 
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

            </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LinearProgress variant="determinate" value={passwordStrength} color={passwordStrength < 80 ? 'secondary' : 'primary'} />
            <Typography variant="body2" style={{ marginTop: 5, marginBottom: 10, color: getPasswordStrengthCategory().color }}>
              Password Strength: {getPasswordStrengthCategory().label}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: '24px 0px 16px', backgroundColor: '#6200ea',  fontFamily: 'Roboto, sans-serif',}}        
            >
              Sign Up
            </Button>
            <Box mt={2}>
              <Typography variant="body2" align="center">
                Already have an account? <Link component="button" variant="body2" onClick={handleLogin}>Sign In</Link>
              </Typography>
            </Box>
          </form>
        </div>
        </div>
    
    
     
    </Container>
    </div>
  );
}

export default Register;
