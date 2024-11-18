
import React from 'react';

const LoadingScreen = () => {
  const style = {
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '90vh',
    },
    spinner: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '10px solid #ccc',
      borderTop: '10px solid #333',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

  return (
    <div style={style.loadingContainer}>
      <div style={style.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingScreen;

