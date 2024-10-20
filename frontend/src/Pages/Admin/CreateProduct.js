import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { getCroppedImg } from '../Utils/cropImage'; 
import Layout from '../../Components/Layout';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [salePrice, setSalePrice] = useState(''); 
  const [productQuantity, setProductQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/category`);
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error('Error fetching categories.');
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/subcategory`);
      setSubcategories(response.data.subcategories || []);
    } catch (error) {
      toast.error('Error fetching subcategories.');
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
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
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('saleprice', salePrice); 
    formData.append('category', selectedCategory);
    formData.append('subcategory', selectedSubcategory);
    formData.append('gender', selectedGender);
    formData.append('quantity', productQuantity);
    formData.append('active', isActive);
  
    if (croppedImage) {
      const imageBlob = await fetch(croppedImage).then(res => res.blob());
      formData.append('image', imageBlob);
    } else {
      toast.error('Image is required.');
      setLoading(false);
      return; 
    }
  
    try {
      const response = await axios.post(`${BACKEND_URL}/product`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/dashboard/admin/products');
        }, 500); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product. Please try again.');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setSalePrice(''); 
    setProductQuantity('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedGender('');
    setImage(null);
    setCroppedImage(null);
    setIsActive(true);
  };

  // Check if all required fields are filled, including image and sale price
  const isFormValid = () => {
    return (
      productName &&
      productDescription &&
      productPrice &&
      salePrice && 
      productQuantity &&
      selectedCategory &&
      selectedSubcategory &&
      selectedGender && 
      croppedImage // Ensure image is selected
    );
  };

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, width: '90%', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>Create Product</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              variant="outlined"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              variant="outlined"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="MRP Price"
              type="number"
              variant="outlined"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sale Price" // New field for sale price
              type="number"
              variant="outlined"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Active</InputLabel>
              <Select
                value={isActive ? 'true' : 'false'} 
                onChange={(e) => setIsActive(e.target.value === 'true')} 
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <Button variant="contained" component="span" sx={{ marginTop: 2 }}>
                Upload Image
              </Button>
            </label>
            {image && (
              <Box sx={{ position: 'relative', height: '200px', width: '200px' }}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  style={{ height: '100%', width: '100%' }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              sx={{ marginRight: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Product'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        <ToastContainer />
      </Box>
    </Layout>
  );
};

export default CreateProduct;
