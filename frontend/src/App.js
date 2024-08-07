import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, LinearProgress, Box } from '@mui/material';
import theme from './Theme';
import React from 'react';

// Lazy load the components
const HomePage = React.lazy(() => import('./Pages/HomePage'));
const PageNotFound = React.lazy(() => import('./Pages/MainPage/PageNotFound'));
const Dress = React.lazy(() => import('./Pages/ProductsPage/Dress/Dress'));
const Toys = React.lazy(() => import('./Pages/ProductsPage/Toys/Toys'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <React.Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#f0f0f0',
              padding: 2,
            }}
          >
             <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
              }}
            />
          </Box>
        }
      >
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/Dress' element={<Dress />} />
          <Route path='/Toys' element={<Toys />} />
          <Route path='*' element={<PageNotFound />} /> 
        </Routes>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
