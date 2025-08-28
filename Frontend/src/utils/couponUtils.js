/**
 * Utility functions for handling coupon operations
 */

/**
 * Validates a coupon code format
 * @param {string} code - The coupon code to validate
 * @returns {boolean} - Whether the coupon code format is valid
 */
export const isValidCouponFormat = (code) => {
  // Coupon code should be alphanumeric, min 3 chars, max 20 chars
  const regex = /^[A-Za-z0-9]{3,20}$/;
  return regex.test(code);
};

/**
 * Format discount display text based on coupon type and value
 * @param {object} coupon - The coupon object
 * @returns {string} - Formatted discount display text
 */
export const formatCouponDiscount = (coupon) => {
  if (!coupon) return '';
  
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}% off`;
  } else {
    return `₹${coupon.discountValue} off`;
  }
};

/**
 * Calculate remaining time for coupon expiration
 * @param {string} validUntil - ISO date string for coupon expiration
 * @returns {object} - Object containing days, hours and formatted display text
 */
export const getCouponTimeRemaining = (validUntil) => {
  if (!validUntil) return { days: 0, hours: 0, display: 'Expired' };
  
  const now = new Date();
  const expiryDate = new Date(validUntil);
  const diffTime = expiryDate - now;
  
  if (diffTime <= 0) {
    return { days: 0, hours: 0, display: 'Expired' };
  }
  
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  let display = '';
  if (days > 0) {
    display = `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    display = `${hours}h ${minutes}m remaining`;
  } else {
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    display = `${minutes}m remaining`;
  }
  
  return { days, hours, display };
};

/**
 * Determine if a coupon is applicable to the given cart items
 * @param {object} coupon - The coupon object
 * @param {array} cartItems - Array of cart items
 * @returns {boolean} - Whether the coupon is applicable
 */
export const isCouponApplicableToCart = (coupon, cartItems) => {
  if (!coupon || !cartItems || !cartItems.length) return false;
  
  // If coupon has applicable products restriction
  if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
    const applicableProductIds = new Set(coupon.applicableProducts.map(p => p.toString()));
    const hasApplicableProduct = cartItems.some(item => applicableProductIds.has(item.id));
    if (!hasApplicableProduct) return false;
  }
  
  // If coupon has applicable categories restriction
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const applicableCategories = new Set(coupon.applicableCategories.map(c => c.toLowerCase()));
    const hasApplicableCategory = cartItems.some(
      item => item.category && applicableCategories.has(item.category.toLowerCase())
    );
    if (!hasApplicableCategory) return false;
  }
  
  return true;
};
