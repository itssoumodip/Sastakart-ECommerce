import React, { useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import googleIcon from '../../assets/google-icon.svg';

const GoogleButton = ({ 
  onSuccess, 
  onError, 
  text = "signin_with", 
  className = "", 
  fallbackToCustom = false 
}) => {
  // Use a ref instead of document.getElementById
  const googleButtonRef = useRef(null);
  
  // If the fallback option is enabled, show a custom button
  if (fallbackToCustom) {
    return (
      <div className={`w-full ${className}`}>
        <button
          type="button"
          onClick={() => {
            // Simply render the standard Google button without the fallback
            fallbackToCustom = false;
          }}
          className="flex-1 border border-gray-300 rounded-md py-3 w-full flex justify-center items-center gap-2 hover:bg-gray-50 transition-all"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
          <span className="text-sm">
            {text === 'signin_with' ? 'Sign in with Google' : 'Sign up with Google'}
          </span>
        </button>
      </div>
    );
  }
  
  // Default: Use the GoogleLogin component directly
  return (
    <div className={`w-full ${className}`}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap
        type="standard"
        theme="filled_blue"
        size="large"
        shape="rectangular"
        text={text}
        width="100%"
      />
    </div>
  );
};

export default GoogleButton;
