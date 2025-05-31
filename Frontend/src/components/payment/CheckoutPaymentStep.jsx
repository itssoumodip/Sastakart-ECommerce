// This is a template for updating the payment step in the Checkout component
const renderPaymentStep = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CheckoutPayment
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentError={paymentError}
        calculateTotal={calculateTotal}
        handlePaymentSuccess={handlePaymentSuccess}
        handlePaymentError={handlePaymentError}
        shippingData={shippingForm.getValues()}
      />

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={handlePrevStep}
          className="btn-outline flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shipping
        </button>
      </div>
    </motion.div>
  );
};
