import { motion } from 'framer-motion';
import { useState } from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  icon = null,
  isLoading = false,
  rounded = 'md'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define variant styles
  const variantStyles = {
    primary: {
      backgroundColor: isHovered ? '#1f2937' : '#000000',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      backgroundColor: isHovered ? '#f3f4f6' : '#ffffff',
      color: '#000000',
      border: '1px solid #000000',
    },
    outline: {
      backgroundColor: isHovered ? '#000000' : 'transparent',
      color: isHovered ? '#ffffff' : '#000000',
      border: '1px solid #000000',
    },
    danger: {
      backgroundColor: isHovered ? '#b91c1c' : '#dc2626',
      color: '#ffffff',
      border: 'none',
    },
    ghost: {
      backgroundColor: isHovered ? '#f3f4f6' : 'transparent',
      color: '#000000',
      border: 'none',
    }
  };

  // Define size styles
  const sizeStyles = {
    small: {
      padding: '6px 16px',
      fontSize: '0.75rem',
    },
    medium: {
      padding: '10px 20px',
      fontSize: '0.875rem',
    },
    large: {
      padding: '12px 32px',
      fontSize: '1rem',
    }
  };
  
  // Define rounded styles
  const roundedStyles = {
    none: { borderRadius: '0' },
    sm: { borderRadius: '0.125rem' },
    md: { borderRadius: '0.375rem' },
    lg: { borderRadius: '0.5rem' },
    full: { borderRadius: '9999px' }
  };
  
  // Combine all styles
  const buttonStyle = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...roundedStyles[rounded],
    width: fullWidth ? '100%' : 'auto',
    fontWeight: '500',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? '0.5' : '1',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: isHovered ? '0 1px 3px rgba(0,0,0,0.12)' : '0 1px 2px rgba(0,0,0,0.05)',
  };
  
  const contentContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };
  
  const iconStyle = {
    marginRight: '8px'
  };
  
  const loadingIconStyle = {
    marginRight: '8px',
    height: '16px',
    width: '16px'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className} // Keep className prop for any custom classes
    >
      {isLoading ? (
        <div style={contentContainerStyle}>
          <svg style={loadingIconStyle} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div style={contentContainerStyle}>
          {icon && <span style={iconStyle}>{icon}</span>}
          {children}
        </div>
      )}
    </motion.button>
  );
};

export default Button;
