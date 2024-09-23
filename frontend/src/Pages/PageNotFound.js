import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Container)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
}));

const Heading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PageNotFound = () => {
  return (
    <Root maxWidth="sm">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Heading variant="h1">404</Heading>
          <Typography variant="h5" gutterBottom>
            Oops! Page not found.
          </Typography>
          <Typography variant="body1">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </Typography>
          <StyledButton
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
          >
            Go to Home
          </StyledButton>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            Need assistance? Contact us at {' '}
            <Link href="mailto:support@example.com">support@gmail.com</Link>
          </Typography>
        </Grid>
      </Grid>
    </Root>
  );
};

export default PageNotFound;
