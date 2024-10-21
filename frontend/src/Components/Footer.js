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
              Welcome to VDG Fashion, your premier destination for stylish dresses, toys, and riders. Our showroom offers an extensive collection of high-quality products, curated with love and passion.
            </Typography>
          </Grid>

          {/* Vision and Mission */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Vision and Mission
            </Typography>
            <Typography variant="body2">- Deliver exceptional quality products</Typography>
            <Typography variant="body2">- Provide outstanding customer service</Typography>
            <Typography variant="body2">- Build lasting relationships</Typography>
          </Grid>

          {/* Founder Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Founder Details
            </Typography>
            <Typography variant="body2">
              Iswariah Sankararajan, Founder of VDG Fashion, is driven by a passion for delivering exceptional customer experiences. With years of expertise in the industry, Iswariah's vision is to provide unique, affordable, and high-quality products that bring joy to our customers.
            </Typography>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Email: <Link href="mailto:Vdgfashion6@gmail.com">Vdgfashion6@gmail.com</Link>
            </Typography>
            <Typography variant="body2">Phone: +91 8300112996</Typography>
            <Typography variant="body2">
              Address: 161/1, Narayana Mall, First Floor, Municipal Office Road, near Karumathi Madam Signal, Virudhunagar 626001
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://facebook.com" color="inherit" aria-label="Follow us on Facebook">
                <Facebook />
              </Link>
              <Link href="https://twitter.com" color="inherit" aria-label="Follow us on Twitter">
                <Twitter />
              </Link>
              <Link href="https://instagram.com" color="inherit" aria-label="Follow us on Instagram">
                <Instagram />
              </Link>
              <Link href="https://linkedin.com" color="inherit" aria-label="Follow us on LinkedIn">
                <LinkedIn />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
