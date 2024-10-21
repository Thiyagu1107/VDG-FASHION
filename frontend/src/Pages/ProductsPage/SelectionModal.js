import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Grid, IconButton, InputLabel, Select, MenuItem } from '@mui/material';
import { Male, Female, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const iconStyle = {
  fontSize: 50,
};

const SelectionModal = ({ open, handleClose, onSelect }) => {
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/subcategory`);
        setSubcategories(response.data.subcategories);
      } catch (err) {
        console.error(err);
      }
    };

    if (open) {
      fetchSubcategories();
    }
  }, [open, BACKEND_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'gender') {
      setGender(value); 
    } else if (name === 'subcategory') {
      setSelectedSubcategory(value);
    }
  };

  const handleSubmit = () => {
    if (!gender || !selectedSubcategory) {
      setError('Please fill in all fields.');
      return;
    }
    onSelect({ gender, subcategory: selectedSubcategory });
    handleClose();
  };

  const handleModalClose = () => {
    handleClose();
    setError('');
    setGender('');
    setSelectedSubcategory('');
    navigate('/');
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableEscapeKeyDown
      BackdropProps={{ onClick: (e) => e.stopPropagation() }} 
    >
      <Box sx={modalStyle}>
        <IconButton onClick={handleModalClose} sx={{ position: 'absolute', top: 10, right: 10 }} aria-label="close">
          <Close />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Choose Your Options
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={gender}
            onChange={handleChange}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel 
                  value="Male" 
                  control={<Radio />} 
                  label={<Box display="flex" alignItems="center"><Male sx={iconStyle} /><Typography sx={{ ml: 1 }}>Male</Typography></Box>} 
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel 
                  value="Female" 
                  control={<Radio />} 
                  label={<Box display="flex" alignItems="center"><Female sx={iconStyle} /><Typography sx={{ ml: 1 }}>Female</Typography></Box>} 
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Age</InputLabel>
          <Select
            value={selectedSubcategory}
            name="subcategory"
            onChange={handleChange}
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory._id} value={subcategory._id}>{subcategory.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ width: '100%' }}
          disabled={!gender || !selectedSubcategory} 
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default SelectionModal;
