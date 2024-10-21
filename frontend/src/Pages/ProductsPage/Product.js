import React, { useState, } from 'react';
import SelectionModal from './SelectionModal';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../../Components/Layout';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s, box-shadow 0.3s',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardMedia = styled(CardMedia)( {
  height: 200,
  objectFit: 'cover',
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'space-between',
}));

const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 500,
  marginBottom: '8px',
}));

const StyledTypographyDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: '#555',
  flexGrow: 0,
  height: '60px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
});

const PriceContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

const StyledTypographyPrice = styled(Typography)({
  fontSize: '1rem',
  color: '#f44336',
  fontWeight: 'bold',
  marginTop: '4px',
});

const StyledTypographyOldPrice = styled(Typography)({
  fontSize: '0.875rem',
  color: '#aaa',
  textDecoration: 'line-through',
  marginBottom: '4px',
});

const ensureDescriptionLength = (description) => {
  const lines = description.split('\n');
  if (lines.length < 3) {
    const additionalLines = new Array(3 - lines.length).fill(" ");
    return lines.concat(additionalLines).join('\n');
  }
  return description;
};

const Product = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(16);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSelect = async (options) => {
    setSelectedOptions(options);
    await fetchProducts(options);
  };

  const fetchProducts = async (options) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/product`, {
        params: {
          subcategoryId: options.subcategory,
          gender: options.gender,
        },
      });
      setProducts(response.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 16));
    setPage(0);
  };

  // Calculate displayed products
  const displayedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout>
      <SelectionModal open={modalOpen} handleClose={handleModalClose} onSelect={handleSelect} />
      <Grid container spacing={2} sx={{ p: 2 }}>
        {displayedProducts.length > 0 ? (
          displayedProducts.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <StyledCard>
                <CardActionArea>
                  <StyledCardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.name}
                  />
                  <StyledCardContent>
                    <StyledTypographyTitle variant="h6">
                      {item.name}
                    </StyledTypographyTitle>
                    <StyledTypographyDescription variant="body2">
                      {ensureDescriptionLength(item.description)}
                    </StyledTypographyDescription>
                    <PriceContainer>
                      <StyledTypographyOldPrice variant="body2">
                        ${item.price}
                      </StyledTypographyOldPrice>
                      <StyledTypographyPrice variant="body2">
                        ${item.saleprice}
                      </StyledTypographyPrice>
                    </PriceContainer>
                  </StyledCardContent>
                </CardActionArea>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Typography>No results found</Typography>
        )}
      </Grid>
      
      <TablePagination
        rowsPerPageOptions={[16, 36, 76]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Layout>
  );
};

export default Product;
