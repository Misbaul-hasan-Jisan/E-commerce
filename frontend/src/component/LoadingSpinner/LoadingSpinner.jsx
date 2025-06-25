import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ variant = 'dots', size = 'medium', color = 'primary' }) => {
  // Size classes
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  // Color classes
  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white',
    dark: 'spinner-dark'
  };

  // Spinner variants
  const spinnerVariants = {
    dots: (
      <div className={`dot-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dot-spinner__dot" />
        ))}
      </div>
    ),
    ring: (
      <div className={`ring-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    ),
    bar: (
      <div className={`bar-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    ),
    circle: (
      <div className={`circle-spinner ${sizeClasses[size]} ${colorClasses[color]}`} />
    )
  };

  return (
    <div className="loading-spinner-container">
      {spinnerVariants[variant] || spinnerVariants.dots}
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;