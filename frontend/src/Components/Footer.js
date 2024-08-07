// src/components/Footer.js

import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#f8f9fa', py: 4 }}>
      <Container>
        <Grid container spacing={4}>
          {/* About Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Grid>

          {/* Vision and Mission */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Vision and Mission
            </Typography>
            <Typography variant="body2">
              Our vision is to create innovative solutions. Our mission is to deliver high-quality services that exceed our customers’ expectations.
            </Typography>
          </Grid>

          {/* Founder Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Founder Details
            </Typography>
            <Typography variant="body2">
              John Doe - CEO & Founder. With over 20 years of experience, John leads the company with a vision to innovate and inspire.
            </Typography>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Email: <Link href="mailto:contact@company.com">contact@company.com</Link>
            </Typography>
            <Typography variant="body2">
              Phone: +123 456 7890
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://facebook.com" color="inherit" aria-label="Facebook">
                <Facebook />
              </Link>
              <Link href="https://twitter.com" color="inherit" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="https://instagram.com" color="inherit" aria-label="Instagram">
                <Instagram />
              </Link>
              <Link href="https://linkedin.com" color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </Link>
            </Box>
          </Grid>
        </Grid>
        {/* <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Address: 1234 Street Name, City, Country
          </Typography>
        </Box> */}
      </Container>
    </Box>
  );
};

export default Footer;
