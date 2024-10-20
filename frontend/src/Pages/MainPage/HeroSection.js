import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/system';
import { Link } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Styled components
const CarouselContainer = styled(Box)({
  position: 'relative',
  height: 'auto',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  padding: 0,
});

const CarouselContent = styled(Box)(({ images }) => ({
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
  width: `${images.length * 100}%`,
}));

const CarouselImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const DotContainer = styled(Box)({
  position: 'absolute',
  bottom: 10,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 8,
});

const Dot = styled(({ active, onClick, ...props }) => (
  <Box {...props} onClick={onClick} />
))(({ active }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  transition: 'background-color 0.3s ease',
}));

const Carousel = ({ images }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      container.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <CarouselContainer>
      <CarouselContent ref={containerRef} images={images}>
        {images.map((image) => (
          <Box key={image.id} sx={{ flex: '0 0 auto', width: '100%' }}>
            <CarouselImage src={image.src} alt={`Image ${image.id}`} />
          </Box>
        ))}
      </CarouselContent>
      <DotContainer>
        {images.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => setCurrentIndex(index)} // Update currentIndex on dot click
          />
        ))}
      </DotContainer>
    </CarouselContainer>
  );
};

// ProductCard component
const ProductCard = ({ product }) => (
  <Link to={`/${product.name.replace(/\s+/g, '-').toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <Card
      sx={{
        mr: 2,
        boxShadow: 2,
        mb: 1,
        borderRadius: 2,
        overflow: 'auto',
        flex: '0 0 auto',
        width: '300px',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="150"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6" sx={{ fontFamily: 'Nunito Sans' }} noWrap>
          {product.name}
        </Typography>
      </CardContent>
    </Card>
  </Link>
);

// HomePage component
const HomePage = () => {
  const scrollContainerRef = useRef(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetching slider and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sliderResponse = await axios.get(`${BACKEND_URL}/slider`);
        setSliderImages(sliderResponse.data.sliders);

        const productResponse = await axios.get(`${BACKEND_URL}/category`);
        setProducts(productResponse.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box>
      <Carousel images={sliderImages.map(slider => ({ id: slider._id, src: slider.imageUrl }))} />
      <Box
        sx={{
          position: 'relative',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: 2,
          marginTop: 2,
          borderRadius: '8px',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Nunito Sans',
            fontSize: '24px',
            fontWeight: 600,
            padding: 1,
            zIndex: 1,
            position: 'sticky',
            top: 0,
            backgroundColor: '#ffffff',
          }}
          noWrap
        >
          Our Products
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton onClick={scrollLeft} sx={{ zIndex: 2, backgroundColor: "#e6edf7", color: 'navy' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'center',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              width: '100%',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {products.map(product => (
              <ProductCard key={product._id} product={{ id: product._id, name: product.name, image: product.imageUrl }} />
            ))}
          </Box>
          <IconButton onClick={scrollRight} sx={{ zIndex: 2, backgroundColor: "#e6edf7", color: 'navy' }}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
