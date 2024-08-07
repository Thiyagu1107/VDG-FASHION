import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Grid, IconButton } from '@mui/material';
import { Male, Female, Close } from '@mui/icons-material';

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
  border: '2px solid navy', 
};

const iconStyle = {
  fontSize: 50,
};

const SelectionModal = ({ open, handleClose, onSelect }) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    if (e.target.name === 'gender') {
      setGender(e.target.value);
    } else if (e.target.name === 'age') {
      setAge(e.target.value);
    }
  };

  const handleSubmit = () => {
    onSelect({ gender, age });
    handleClose(); // Close the modal directly without validation
  };

  // Allow closing of the modal directly
  const handleModalClose = (event, reason) => {
    handleClose(); // Close the modal directly without validation
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <Close />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Choose Your Options
        </Typography>
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
                  value="boy"
                  control={<Radio />}
                  label={<Box display="flex" alignItems="center"><Male sx={iconStyle} /><Typography sx={{ ml: 1 }}>Boy</Typography></Box>}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  value="girl"
                  control={<Radio />}
                  label={<Box display="flex" alignItems="center"><Female sx={iconStyle} /><Typography sx={{ ml: 1 }}>Girl</Typography></Box>}
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>
        <TextField
          label="Age"
          type="number"
          fullWidth
          variant="outlined"
          name="age"
          value={age}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ width: '100%' }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default SelectionModal;
