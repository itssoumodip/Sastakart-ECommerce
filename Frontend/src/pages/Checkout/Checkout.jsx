import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiCheck, FiCreditCard, FiLock, FiShoppingBag, FiTruck, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { clearCart } from '../../store/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get cart items from Redux
  const { items, total: subtotal, itemCount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // State for checkout steps
  const [activeStep, setActiveStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  
  // State for shipping address form
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phoneNo: ''
  });
  
  // State for payment information
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Calculate shipping cost
  const shippingCost = subtotal > 100 ? 0 : 10;
  
  // Calculate tax
  const taxRate = 0.1; // 10%
  const taxAmount = subtotal * taxRate;
  
  // Calculate grand total
  const grandTotal = subtotal + shippingCost + taxAmount;
  
  // Handle shipping form change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle payment info change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
      setPaymentInfo({
        ...paymentInfo,
        [name]: formatted.slice(0, 19) // Limit to 16 digits + 3 spaces
      });
    } 
    // Format expiry date with slash
    else if (name === 'expiryDate') {
      const digits = value.replace(/\D/g, '');
      let formatted = digits;
      
      if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      }
      
      setPaymentInfo({
        ...paymentInfo,
        [name]: formatted
      });
    } 
    // Limit CVV to 3 or 4 digits
    else if (name === 'cvv') {
      const digits = value.replace(/\D/g, '');
      setPaymentInfo({
        ...paymentInfo,
        [name]: digits.slice(0, 4)
      });
    }
    else {
      setPaymentInfo({
        ...paymentInfo,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate shipping info
  const validateShippingInfo = () => {
    const newErrors = {};
    
    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!shippingInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!shippingInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.postalCode)) {
      newErrors.postalCode = 'Invalid postal code format';
    }
    
    if (!shippingInfo.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingInfo.phoneNo.replace(/\D/g, ''))) {
      newErrors.phoneNo = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate payment info
  const validatePaymentInfo = () => {
    const newErrors = {};
    
    if (!paymentInfo.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Use MM/YY format';
    } else {
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateShippingInfo()) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      if (validatePaymentInfo()) {
        setActiveStep(3);
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Handle order submit
  const handlePlaceOrder = () => {
    // Simulate order processing
    setIsNextDisabled(true);
    
    setTimeout(() => {
      // In a real app, this would dispatch an action to place the order
      console.log('Order placed with:', {
        items,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`,
          cvv: '***'
        },
        subtotal,
        shippingCost,
        taxAmount,
        grandTotal
      });
      
      // Clear cart
      dispatch(clearCart());
      
      // Redirect to order confirmation
      navigate('/checkout/success');
    }, 2000);
  };
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && activeStep === 1) {
      navigate('/cart');
    }
  }, [items, navigate, activeStep]);
  
  // Load user info if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const [firstName, ...lastNameArray] = (user.name || '').split(' ');
      const lastName = lastNameArray.join(' ');
      
      setShippingInfo(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
      }));
    }
  }, [isAuthenticated, user]);
  
  // Render checkout steps
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleShippingChange}
                error={errors.firstName}
                required
              />
              
              <Input
                label="Last Name"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleShippingChange}
                error={errors.lastName}
                required
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  error={errors.address}
                  required
                />
              </div>
              
              <Input
                label="City"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                error={errors.city}
                required
              />
              
              <Input
                label="State"
                name="state"
                value={shippingInfo.state}
                onChange={handleShippingChange}
                error={errors.state}
                required
              />
              
              <Input
                label="Postal Code"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleShippingChange}
                error={errors.postalCode}
                required
              />
              
              <Input
                label="Country"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                disabled
              />
              
              <Input
                label="Phone Number"
                name="phoneNo"
                value={shippingInfo.phoneNo}
                onChange={handleShippingChange}
                error={errors.phoneNo}
                required
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleNextStep}>
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Payment Information</h2>
            
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mb-6">
              <div className="flex items-center text-gray-700 mb-2">
                <FiLock className="mr-2" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-500">
                Your payment information is encrypted and secure. We do not store your full card details.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Name on Card"
                name="cardName"
                value={paymentInfo.cardName}
                onChange={handlePaymentChange}
                error={errors.cardName}
                required
              />
              
              <Input
                label="Card Number"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                error={errors.cardNumber}
                placeholder="XXXX XXXX XXXX XXXX"
                icon={<FiCreditCard className="text-gray-400" />}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentChange}
                  error={errors.expiryDate}
                  placeholder="MM/YY"
                  required
                />
                
                <Input
                  label="CVV"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                  error={errors.cvv}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>
                Back to Shipping
              </Button>
              
              <Button onClick={handleNextStep}>
                Review Order
              </Button>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Review Your Order</h2>
            
            {/* Shipping Information Summary */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium flex items-center">
                  <FiUser className="mr-2" /> Shipping Information
                </h3>
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-sm text-black hover:underline"
                >
                  Edit
                </button>
              </div>
              
              <div className="text-sm text-gray-700 space-y-1">
                <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
                <p>{shippingInfo.country}</p>
                <p>Phone: {shippingInfo.phoneNo}</p>
              </div>
            </div>
            
            {/* Payment Method Summary */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium flex items-center">
                  <FiCreditCard className="mr-2" /> Payment Method
                </h3>
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-sm text-black hover:underline"
                >
                  Edit
                </button>
              </div>
              
              <div className="text-sm text-gray-700">
                <p>Credit Card</p>
                <p>{paymentInfo.cardName}</p>
                <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                <p>Expires: {paymentInfo.expiryDate}</p>
              </div>
            </div>
            
            {/* Order Items Summary */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium flex items-center">
                  <FiShoppingBag className="mr-2" /> Order Items ({itemCount})
                </h3>
                <button
                  onClick={() => navigate('/cart')}
                  className="text-sm text-black hover:underline"
                >
                  Edit
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div className="flex">
                      <div className="w-12 h-12 mr-3 flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shipping Method */}
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium flex items-center mb-2">
                <FiTruck className="mr-2" /> Shipping Method
              </h3>
              
              <div className="text-sm text-gray-700">
                <p>{shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping'}</p>
                <p>Estimated delivery: 3-5 business days</p>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>
                Back to Payment
              </Button>
              
              <Button
                onClick={handlePlaceOrder}
                isLoading={isNextDisabled}
                disabled={isNextDisabled}
              >
                Place Order
              </Button>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Steps */}
        <div className="w-full lg:w-2/3">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Shipping' },
                { step: 2, label: 'Payment' },
                { step: 3, label: 'Review' }
              ].map(({ step, label }) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      activeStep >= step
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {activeStep > step ? <FiCheck size={20} /> : step}
                  </div>
                  <div className="text-sm mt-2">{label}</div>
                </div>
              ))}
            </div>
            
            <div className="relative mt-2">
              <div className="absolute left-0 right-0 h-1 top-1/2 transform -translate-y-1/2 bg-gray-200"></div>
              <div
                className="absolute left-0 h-1 top-1/2 transform -translate-y-1/2 bg-black transition-all duration-300"
                style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderStepContent()}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Secure Checkout Note */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <div className="flex justify-center items-center gap-1 mb-2">
                <FiLock className="text-gray-400" />
                Secure Checkout
              </div>
              <p>
                Your payment information is processed securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
