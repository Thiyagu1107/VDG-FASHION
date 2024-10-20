/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../Utils/cropImage';
import axios from 'axios';

const Slider = () => {
  const [image, setImage] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/slider`);
      setImages(response.data.sliders || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setSnackbarMessage('Error fetching images.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [BACKEND_URL]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        setSnackbarMessage('File size must be less than 3 MB.');
        setSnackbarOpen(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
    const croppedImg = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(croppedImg);
  };

  const handleSubmit = async () => {
    if (!croppedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', await fetch(croppedImage).then(res => res.blob()));

    try {
      await axios.post(`${BACKEND_URL}/slider`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnackbarMessage('Image uploaded successfully!');
      fetchImages();
      resetImageState();
    } catch (error) {
      console.error('Error uploading image:', error);
      setSnackbarMessage('Error uploading image. Please try again.');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/slider/${id}`);
      setImages((prev) => prev.filter(img => img._id !== id));
      setSnackbarMessage('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbarMessage('Error deleting image. Please try again.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const resetImageState = () => {
    setImage('');
    setCroppedImage(null);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const indexOfLastImage = currentPage * itemsPerPage;
  const indexOfFirstImage = indexOfLastImage - itemsPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, width: '90%', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>Slider Image </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
          <input
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <Button variant="contained" component="span">
                Upload
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sm={5} container justifyContent="flex-end">
            <Button variant="outlined" onClick={resetImageState} disabled={!croppedImage || loading} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={!croppedImage || loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Grid>
        </Grid>

        {image && (
          <Grid container spacing={2} sx={{ marginTop: 2 }} justifyContent="center">
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', height: '400px', width: '1600px', backgroundColor: 'transparent' }}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1600 / 400} // Set the aspect ratio to 1600x400
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
                />
              </Box>
            </Grid>
            {croppedImage && (
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%', height: 'auto', border: '2px solid #1976d2', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentImages.map((img, index) => (
                <TableRow key={img._id}>
                  <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell>
                    <img src={img.imageUrl} alt={`Uploaded ${index}`} style={{ width: '100px', height: 'auto' }} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(img._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Pagination count={totalPages} page={currentPage} onChange={(event, value) => setCurrentPage(value)} color="primary" />
        </Box>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Layout>
  );
};

export default Slider;

