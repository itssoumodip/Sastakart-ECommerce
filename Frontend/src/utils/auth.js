import Cookies from 'js-cookie';

export const getAuthToken = () => {
  return Cookies.get('token') || null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  console.log('Auth headers - token exists:', !!token);
  
  if (token) {
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } else {
    console.warn('No authentication token found when creating headers');
    return {
      'Content-Type': 'application/json'
    };
  }
};
