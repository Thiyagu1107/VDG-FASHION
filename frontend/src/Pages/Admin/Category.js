import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  TextField,
  TablePagination,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { getCroppedImg } from '../Utils/cropImage';
import Layout from '../../Components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryManager = () => {
  const [image, setImage] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/category`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [BACKEND_URL]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        toast.error('File size must be less than 3 MB.');
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
    setLoading(true);
    const formData = new FormData();

    if (editingCategoryId) {
      if (categoryName) {
        formData.append('name', categoryName);
      }

      if (croppedImage) {
        const imageBlob = await fetch(croppedImage).then(res => res.blob());
        formData.append('image', imageBlob);
      }
    } else {
      if (!categoryName) {
        toast.error('Category Name is required.');
        setLoading(false);
        return;
      }
      formData.append('name', categoryName);

      if (!croppedImage) {
        toast.error('Please upload and crop an image.');
        setLoading(false);
        return;
      }
      const imageBlob = await fetch(croppedImage).then(res => res.blob());
      formData.append('image', imageBlob);
    }

    try {
      let response;
      if (editingCategoryId) {
        response = await axios.put(`${BACKEND_URL}/category/${editingCategoryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post(`${BACKEND_URL}/category`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success(response.data.message || 'Operation successful!');
      fetchCategories();
      resetImageState();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Error saving category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/category/${id}`);
      setCategories((prev) => prev.filter(cat => cat._id !== id));
      toast.success('Category deleted successfully.');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category. Please try again.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setCategoryName(category.name);
    setImage('');
    setCroppedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const resetImageState = () => {
    setImage('');
    setCroppedImage(null);
    setCategoryName('');
    setEditingCategoryId(null);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate displayed categories
  const displayedCategories = categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, width: '90%', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>Category Manager
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: 2 }} alignItems="center">
          <Grid item xs={8} sm={7}>
            <TextField
              label="Category Name"
              variant="outlined"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              error={!categoryName && !editingCategoryId}
              helperText={!categoryName && !editingCategoryId ? 'Category Name is required.' : ''}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <Button variant="contained" component="span" fullWidth>
                Upload
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sm={3} container justifyContent="flex-end">
            <Button variant="outlined" onClick={resetImageState} disabled={!croppedImage || loading} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || (editingCategoryId ? !categoryName : !croppedImage)}
            >
              {loading ? <CircularProgress size={24} /> : (editingCategoryId ? 'Update' : 'Submit')}
            </Button>
          </Grid>
        </Grid>

        {image && (
          <Grid container spacing={2} sx={{ marginTop: 2 }} justifyContent="center">
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', height: '400px', width: '400px', backgroundColor: 'transparent' }}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={600 / 400}
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
                  <img src={croppedImage} alt="Cropped" style={{ width: '600px', height: '400px', border: '2px solid #1976d2', borderRadius: '4px' }} />
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
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCategories.map((cat, index) => (
                <TableRow key={cat._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <img src={cat.imageUrl} alt={`Category ${index}`} style={{ width: '100px', height: 'auto' }} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(cat)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(cat._id)} sx={{ marginLeft: 1 }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Component */}
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <ToastContainer />
      </Box>
    </Layout>
  );
};

export default CategoryManager;
