import React from 'react';
import { motion } from 'framer-motion';
import { formatCouponDiscount } from '../../utils/couponUtils';
import { Tag, X, CheckCircle } from 'lucide-react';

/**
 * Component to display an applied coupon
 */
const CouponCode = ({ coupon, onRemove }) => {
  if (!coupon) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Tag className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium text-green-800">{coupon.code}</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Applied
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <p className="text-xs text-green-700">{coupon.description}</p>
            <span className="text-xs font-medium text-green-800">
              {formatCouponDiscount(coupon)}
            </span>
          </div>
        </div>
      </div>
      <motion.button
        onClick={onRemove}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="text-green-600 hover:text-green-700 w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default CouponCode;
