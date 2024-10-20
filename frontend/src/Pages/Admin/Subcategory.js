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
import axios from 'axios';
import Layout from '../../Components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubcategoryManager = () => {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/subcategory`);
      setSubcategories(response.data.subcategories || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Error fetching subcategories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [BACKEND_URL]);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = { name: subcategoryName };

    try {
      if (editingSubcategoryId) {
        const response = await axios.put(`${BACKEND_URL}/subcategory/${editingSubcategoryId}`, formData);
        toast.success(response.data.message || 'Subcategory updated successfully!');
      } else {
        const response = await axios.post(`${BACKEND_URL}/subcategory`, formData);
        toast.success(response.data.message || 'Subcategory created successfully!');
      }
      fetchSubcategories();
      resetForm();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error(error.response?.data?.message || 'Error saving subcategory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/subcategory/${id}`);
      setSubcategories((prev) => prev.filter(sub => sub._id !== id));
      toast.success(response.data.message || 'Subcategory deleted successfully.');
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory. Please try again.');
    }
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategoryId(subcategory._id);
    setSubcategoryName(subcategory.name);
  };

  const resetForm = () => {
    setSubcategoryName('');
    setEditingSubcategoryId(null);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate displayed subcategories
  const displayedSubcategories = subcategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, width: '90%', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>Subcategory Manager</Typography>
        
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Subcategory Name"
              variant="outlined"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              fullWidth
              error={!subcategoryName  }
              helperText={!subcategoryName  ? 'Subcategory Name is required.' : ''}
            />
          </Grid>
          <Grid item xs={12} md={4} container justifyContent="flex-end">
            <Button variant="outlined" onClick={resetForm} disabled={loading} sx={{ marginRight: 1, height: '40px', marginTop: 2}} >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !subcategoryName}
              sx={{ marginRight: 1, height: '40px', marginTop: 2}} 
            >
              {loading ? <CircularProgress size={24} /> : (editingSubcategoryId ? 'Update' : 'Submit')}
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedSubcategories.map((sub, index) => (
                <TableRow key={sub._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(sub)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(sub._id)} sx={{ marginLeft: 1 }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={subcategories.length}
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

export default SubcategoryManager;
