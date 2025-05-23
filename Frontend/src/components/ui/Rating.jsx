import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const Rating = ({ value, onChange, size = 'medium', readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Size dimensions for stars
  const sizeDimensions = {
    small: { width: '0.75rem', height: '0.75rem' },
    medium: { width: '1rem', height: '1rem' },
    large: { width: '1.25rem', height: '1.25rem' }
  };
  
  // Styles for the rating component
  const ratingStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      cursor: readOnly ? 'default' : 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      padding: '2px',
    },
    star: (ratingValue) => ({
      ...sizeDimensions[size],
      color: ratingValue <= (hoverRating || value) ? '#000000' : '#d1d5db',
      fill: ratingValue <= (hoverRating || value) ? '#000000' : 'none',
      transition: 'color 200ms ease, fill 200ms ease',
    }),
  };
  
  return (
    <div style={ratingStyles.container}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <button
            type="button"
            key={index}
            style={ratingStyles.button}
            onClick={() => !readOnly && onChange && onChange(ratingValue)}
            onMouseEnter={() => !readOnly && setHoverRating(ratingValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            aria-label={`Rate ${ratingValue} out of 5 stars`}
            disabled={readOnly}
          >
            <FiStar 
              style={ratingStyles.star(ratingValue)}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
