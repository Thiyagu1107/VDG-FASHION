import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/system';
import {Link} from "react-router-dom";

// Example images for the carousel
const images = [
  { id: 1, src: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/2ea57ef59b0820b3.jpg?q=20' },
  { id: 2, src: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/dff6511cbf3c625e.jpg?q=20' },
  { id: 3, src: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/8f0276d685199540.jpg?q=20' },
  { id: 4, src: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/a81653ffec97986c.jpg?q=20' },
  { id: 5, src: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/8f0276d685199540.jpg?q=20' },
];


const products = [
  { id: 1, name: 'Dress', image: 'https://www.polyestermfg.com/wp-content/uploads/2021/11/Fabric-Finishing-Process%EF%BC%881%EF%BC%89-2.jpg' },
  { id: 2, name: 'Toys', image: 'https://cdn.firstcry.com/education/2022/11/06094158/Toy-Names-For-Kids.jpg' },
  { id: 3, name: 'Stationary', image: 'https://5.imimg.com/data5/RD/XV/MY-18339614/all-stationery-office.png' },
  { id: 4, name: 'Fancy Items', image: 'https://c8.alamy.com/comp/J39J2H/st-ives-cornwall-uk-april-3-2017-colourful-homeware-items-for-sale-J39J2H.jpg' },
  { id: 5, name: 'Riders', image: 'https://media.istockphoto.com/id/677022004/photo/outfit-of-biker-and-accessories-with-copy-space.jpg?s=612x612&w=0&k=20&c=yV4GrjZeIvsfic7-b8nHzk61mEbaOrjsAluQEEVRjMo=' },
  { id: 6, name: 'New Born Kid', image: 'https://www.shutterstock.com/image-photo/flat-lay-baby-sleep-accessories-600nw-2187497703.jpg' },
  { id: 7, name: 'Books', image: 'https://st2.depositphotos.com/1105977/5461/i/450/depositphotos_54615585-stock-photo-old-books-on-wooden-table.jpg' },
];


const CarouselContainer = styled(Box)({
  position: 'relative',
  height: 'auto',
  borderRadius:'8px', 
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  padding: 0,
});

const CarouselContent = styled(Box)(({ images }) => ({
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
  width: `${images.length * 100}%`, // Use images.length instead of numimages
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

const Dot = styled(Box)(({ active }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  transition: 'background-color 0.3s ease',
  // Remove `active` prop from DOM element
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
        <Dot key={index} active={index === currentIndex} />
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
      <Carousel images={images} />
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
              overflowX: 'auto', // Enable horizontal scrolling
              scrollBehavior: 'smooth',
              width: '100%',
              '&::-webkit-scrollbar': {
                display: 'none', // Hide scrollbar for Webkit browsers
              },
            }}
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
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
