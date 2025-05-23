import { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  fullWidth = true,
  onBlur,
  icon = null,
  rounded = 'md'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Define rounded styles
  const roundedStyles = {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  };
  
  // Container styles
  const containerStyle = {
    marginBottom: '1rem',
    width: fullWidth ? '100%' : 'auto',
  };
  
  // Label styles
  const labelStyle = {
    display: 'block',
    color: '#1f2937',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
  };
  
  // Required asterisk styles
  const requiredStyle = {
    color: '#000000',
    marginLeft: '0.25rem',
  };
  
  // Input container styles
  const inputContainerStyle = {
    position: 'relative',
    borderColor: error ? '#ef4444' : (isFocused ? '#000000' : '#e5e7eb'),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: roundedStyles[rounded],
    boxShadow: isFocused ? '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px #000000' : 
                isHovered ? '0 4px 6px rgba(0,0,0,0.05)' : '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 200ms ease',
  };
  
  // Icon container styles
  const iconContainerStyle = {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    paddingLeft: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    color: '#6b7280',
  };
  
  // Input element styles
  const inputStyle = {
    display: 'block',
    width: '100%',
    borderRadius: roundedStyles[rounded],
    transition: 'all 200ms ease',
    backgroundColor: disabled ? '#f9fafb' : '#ffffff',
    opacity: disabled ? '0.7' : '1',
    cursor: disabled ? 'not-allowed' : 'text',
    paddingLeft: icon ? '2.5rem' : '1rem',
    paddingTop: '0.625rem',
    paddingBottom: '0.625rem',
    paddingRight: '1rem',
    color: '#111827',
    fontSize: '0.875rem',
    outline: 'none',
    border: 'none',
  };
  
  // Error message styles
  const errorStyle = {
    marginTop: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#dc2626',
    paddingLeft: '0.25rem',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <motion.label 
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          htmlFor={name} 
          style={labelStyle}
        >
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </motion.label>
      )}

      <div 
        style={inputContainerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {icon && (
          <div style={iconContainerStyle}>
            {icon}
          </div>
        )}

        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          required={required}
        />
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={errorStyle}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
