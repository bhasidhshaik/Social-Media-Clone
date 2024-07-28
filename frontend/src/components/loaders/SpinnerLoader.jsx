import React from 'react';

const SpinnerLoader = ({ size }) => {
  const sizes = {
    small: 20,
    medium: 40,
    large: 60,
  };

  const isValidSize = ['small', 'medium', 'large'].includes(size);

  if (!isValidSize) {
    console.error(`Invalid prop 'size' supplied to 'SpinnerLoader'. Expected one of 'small', 'medium', 'large', but received '${size}'.`);
    return null;
  }

  const spinnerStyle = {
    width: `${sizes[size]}px`,
    height: `${sizes[size]}px`,
    border: '4px solid #B3B3B3',
    borderRadius: '50%',
    borderTop: '4px solid #FFF',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div>
      <div style={spinnerStyle} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SpinnerLoader;
