import React, { useState } from 'react';
import Layout from '../../../Components/Layout';
import SelectionModal from '../Dress/SelectionModal';
import { Grid, Card, CardContent, Typography, CardMedia, CardActionArea } from '@mui/material';
import { styled } from '@mui/material/styles';



const mockData = {
  boy: {
    1: [
      { title: 'Baby Boy Outfit 1', img: 'https://www.shutterstock.com/image-photo/little-baby-boy-sitting-on-260nw-450170320.jpg', description: 'Comfortable outfit for a baby boy' },
      { title: 'Baby Boy Outfit 2', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_fol99YVzCU2KY-TmQebIZ2xlxL5TTXZhviB4eozGI-y0hTRWSvpCStGMkJcIDryWG4g&usqp=CAU', description: 'Cute and cozy for a baby boy' },
    ],
    2: [
      { title: 'Toddler Boy Outfit 1', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT92umkBj0mkRhP6M5gnnwFLVEGacwA325FjQ&s', description: 'Stylish outfit for toddlers' },
      
    ],
    3: [
      { title: 'Preschool Boy Outfit 1', img: 'https://i.pinimg.com/originals/81/19/c4/8119c4453ce2fd9cb36a7a7d41a55e0b.jpg', description: 'Fun and playful outfit for preschoolers' },
      { title: 'Preschool Boy Outfit 2', img: 'https://images.pexels.com/photos/1619697/pexels-photo-1619697.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', description: 'Comfortable and cute for preschoolers' },
    ],
    4: [
      { title: 'Young Boy Outfit 1', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ6STiItKNjoASBX7XOVw9OepLoQmmyfFftw&s', description: 'Smart outfit for young boys' },

    ],
    5: [
      { title: 'Big Boy Outfit 1', img: 'https://via.placeholder.com/150?text=Boy+5-1', description: 'Stylish outfit for older boys' },
    
    ],
  },
  girl: {
    1: [
      { title: 'Baby Girl Outfit 1', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ6STiItKNjoASBX7XOVw9OepLoQmmyfFftw&s', description: 'Adorable outfit for a baby girl' },
      { title: 'Baby Girl Outfit 2', img: 'https://static.vecteezy.com/system/resources/thumbnails/029/663/592/small_2x/adorable-baby-with-vibrant-clothing-in-a-playful-pose-ai-generative-photo.jpg', description: 'Cozy and cute for a baby girl' },
    ],
    2: [
      { title: 'Toddler Girl Outfit 1', img: 'https://w0.peakpx.com/wallpaper/492/699/HD-wallpaper-little-girl-with-rabbit-in-hands-little-girl-children-cute-rabbit-thumbnail.jpg', description: 'Stylish outfit for toddlers' },
    ],
    3: [
      { title: 'Preschool Girl Outfit 1', img: 'https://w0.peakpx.com/wallpaper/492/699/HD-wallpaper-little-girl-with-rabbit-in-hands-little-girl-children-cute-rabbit-thumbnail.jpg', description: 'Fun and fashionable for preschoolers' },
      { title: 'Preschool Girl Outfit 2', img: 'https://wallpapercave.com/wp/wp4388961.jpg', description: 'Cute and comfortable for preschoolers' },
    ],
    4: [
      { title: 'Young Girl Outfit 1', img: 'https://wallpapercave.com/wp/wp4388961.jpg', description: 'Smart and stylish for young girls' },
      { title: 'Young Girl Outfit 2', img: 'https://www.hdwallpapers.in/download/blonde_hair_cute_small_girl_is_standing_on_field_with_shallow_background_of_cloudy_sky_and_sunrise_hd_cute-1920x1080.jpg', description: 'Fashionable and fun for young girls' },
    ],
  },
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: 'cover',
});

const StyledCardContent = styled(CardContent)({
  padding: '16px',
});

const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 500,
}));

const StyledTypographyDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: '#555',
});

const Dress = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSelect = (options) => {
    setSelectedOptions(options);
  };

  return (
    <Layout>
      <SelectionModal open={modalOpen} handleClose={handleModalClose} onSelect={handleSelect} />
      {selectedOptions && (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {mockData[selectedOptions.gender][selectedOptions.age]?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <CardActionArea>
                  <StyledCardMedia
                    component="img"
                    image={item.img}
                    alt={item.title}
                  />
                  <StyledCardContent>
                    <StyledTypographyTitle variant="h6">
                      {item.title}
                    </StyledTypographyTitle>
                    <StyledTypographyDescription variant="body2">
                      {item.description}
                    </StyledTypographyDescription>
                  </StyledCardContent>
                </CardActionArea>
              </StyledCard>
            </Grid>
          )) || <Typography>No results found</Typography>}
        </Grid>
      )}
    </Layout>
  );
};

export default Dress;
