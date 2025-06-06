import React from 'react';
import PropTypes from 'prop-types';

const UserAvatar = ({ avatar, firstName, lastName, size = 'md', className = '', onClick, ...rest }) => {
  // Convert size names to pixel values
  const sizeMap = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };
  
  const sizeClass = sizeMap[size] || size; // Use predefined sizes or custom size

  // Get initials from name for fallback
  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  if (avatar && avatar !== 'default-avatar.jpg') {
    // Display the avatar image
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border border-gray-200 flex-shrink-0 ${className}`} onClick={onClick} {...rest}>
        <img
          src={avatar}
          alt={`${firstName || ''} ${lastName || ''}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            // Replace with initials on error
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="w-full h-full bg-gray-500 flex items-center justify-center text-white font-bold">
                ${getInitials()}
              </div>
            `;
          }}
        />
      </div>
    );
  } else {
    // Display initials
    return (
      <div 
        className={`${sizeClass} rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`} 
        onClick={onClick}
        {...rest}
      >
        {getInitials()}
      </div>
    );
  }
};

UserAvatar.propTypes = {
  avatar: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default UserAvatar;
