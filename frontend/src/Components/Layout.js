import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Helmet from 'react-helmet'; // for SEO function

const Layout = ({
  children,
  title = "VDG FASHION - shop now",
  description = "VDG FASHION",
  keywords = "VDG FASHION",
  author = "VDG FASHION"
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keyword" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: '83vh', padding: 20, backgroundColor: '#e6edf7' }}>
        {children /* Render children props here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
