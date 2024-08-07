import React from 'react';
import Header from './Header';
import Footer from './Footer';




const Layout = ({ children}) => {
  return (
    <div>      
      <Header />
      <main style={{ minHeight: '83vh', padding:20, backgroundColor:'#e6edf7'}}>
        {children /* Render children prps  here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;