import React from 'react';
import '../style/notfound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Page Not Found</p>
      <p className="notfound-message">Sorry, the page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="notfound-button">Go Back Home</a>
    </div>
  );
};

export default NotFound;
