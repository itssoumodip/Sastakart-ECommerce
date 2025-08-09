import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import googleIcon from '../../assets/google-icon.svg';

const GoogleButton = ({ 
  onSuccess, 
  onError, 
  text = "signin_with", 
  className = "" 
}) => {
  // Simple custom button that looks like Google's
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          type="standard"
          text={text}
          shape="rectangular"
          logo_alignment="center"
        />
      </div>
    </div>
  );
};

export default GoogleButton;
