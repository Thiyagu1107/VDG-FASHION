import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../Components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Provide a default URL
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/product/all`);
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        toast.error('No products found.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Removed BACKEND_URL from dependency array

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/product/${id}`);
      setProducts((prev) => prev.filter(product => product._id !== id));
      toast.success('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/admin/edit-product/${id}`);
  };
  
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate displayed products
  const displayedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, width: '90%', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>Product Manager</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard/admin/create-product')} 
          >
            Add Product
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>MRP Price</TableCell>
                <TableCell>Sale Price</TableCell>
                <TableCell>Gender</TableCell> 
                <TableCell>Image</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((prod, index) => (
                  <TableRow key={prod._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>{prod.description}</TableCell>
                    <TableCell>{prod.price}</TableCell>
                    <TableCell>{prod.saleprice}</TableCell>
                    <TableCell>{prod.gender}</TableCell>
                    <TableCell>
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} style={{ width: '100px', height: 'auto' }} />
                      ) : ( 
                        'No Image'
                      )}
                    </TableCell>
                    <TableCell>{prod.isactive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEdit(prod._id)} 
                          sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(prod._id)} 
                          sx={{ marginLeft: 1, '&:hover': { transform: 'scale(1.1)' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">No products available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={products.length}
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

export default ProductManager;
