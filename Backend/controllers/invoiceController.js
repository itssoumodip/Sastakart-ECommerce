const PDFDocument = require('pdfkit');
const Order = require('../models/order');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Generate and download invoice PDF => /api/orders/:id/invoice
const generateInvoice = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if user owns this order (unless admin)
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('You are not authorized to access this invoice', 403));
  }

  // Only allow invoice download for delivered orders
  if (order.orderStatus !== 'Delivered') {
    return next(new ErrorHandler('Invoice can only be downloaded for delivered orders', 400));
  }

  // Create PDF document
  const doc = new PDFDocument({ margin: 50 });
  
  // Generate fallback invoice number if missing with shorter timestamp
  const timestamp = Date.now().toString();
  let invoiceNumber = order.gstSummary?.invoiceNumber || `INV-${timestamp.slice(-6)}`;
  
  // If the existing invoice number is too long (more than 15 characters), create a shorter one
  if (invoiceNumber.length > 15) {
    invoiceNumber = `INV-${timestamp.slice(-6)}`;
  }
  
  // Set response headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceNumber}.pdf"`);
  
  // Handle errors
  doc.on('error', (err) => {
    console.error('PDF generation error:', err);
    if (!res.headersSent) {
      return next(new ErrorHandler('Error generating PDF invoice', 500));
    }
  });

  // Pipe PDF to response
  doc.pipe(res);

  // Add content to PDF
  generateInvoiceContent(doc, order);
  
  // Finalize the document
  doc.end();
});

function generateInvoiceContent(doc, order) {
  // Generate a cleaner invoice number format with shorter timestamp
  const timestamp = Date.now().toString();
  let invoiceNumber = order.gstSummary?.invoiceNumber || `INV-${timestamp.slice(-6)}`;
  
  // If the existing invoice number is too long (more than 10 characters), create a shorter one
  if (invoiceNumber.length > 15) {
    invoiceNumber = `INV-${timestamp.slice(-6)}`;
  }
  
  // Add company header with better styling
  doc.fontSize(24)
     .fillColor('#000')
     .text('SastaKart', 50, 50, { align: 'left' })
     .fontSize(10)
     .fillColor('#666')
     .text('Your Trusted E-commerce Partner', 50, 80)
     .text('Email: support@sastakart.com', 50, 95)
     .text('Website: sastakart.vercel.app', 50, 110);

  // Add invoice title and number with better styling
  doc.fontSize(24)
     .fillColor('#000')
     .text('INVOICE', 400, 50, { align: 'right' })
     .fontSize(11)
     .fillColor('#000')
     .text(`Invoice No: ${invoiceNumber}`, 320, 80, { align: 'right' })
     .text(`Order ID: #${order._id.toString().slice(-8)}`, 320, 95, { align: 'right' })
     .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 320, 110, { align: 'right' });

  // Add line separator
  doc.moveTo(50, 140)
     .lineTo(560, 140)
     .strokeColor('#000')
     .lineWidth(2)
     .stroke()
     .strokeColor('#000')
     .lineWidth(1);

  // Add billing information
  doc.fontSize(14)
     .fillColor('#000')
     .text('Bill To:', 50, 160)
     .fontSize(11)
     .text(`${order.user.name}`, 50, 180)
     .text(`${order.user.email}`, 50, 195)
     .text(`${order.shippingInfo.address}`, 50, 210)
     .text(`${order.shippingInfo.city}, ${order.shippingInfo.state}`, 50, 225)
     .text(`${order.shippingInfo.postalCode}, ${order.shippingInfo.country}`, 50, 240)
     .text(`Phone: ${order.shippingInfo.phoneNo}`, 50, 255);

  // Add order details
  doc.fontSize(14)
     .text('Order Details:', 300, 160)
     .fontSize(12)
     .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 300, 180)
     .text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`, 300, 195)
     .text(`Status: ${order.orderStatus}`, 300, 210);

  if (order.deliveredAt) {
    doc.text(`Delivered On: ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}`, 300, 225);
  }

  // Add items table header with proper spacing
  const tableTop = 300;
  doc.fontSize(12)
     .fillColor('#000')
     .text('Item', 50, tableTop)
     .text('Qty', 340, tableTop, { width: 30, align: 'center' })
     .text('Rate', 390, tableTop, { width: 50, align: 'right' })
     .text('GST', 460, tableTop, { width: 40, align: 'right' })
     .text('Amount', 520, tableTop, { width: 50, align: 'right' });

  // Add line under header
  doc.moveTo(50, tableTop + 15)
     .lineTo(570, tableTop + 15)
     .stroke();

  // Add items
  let currentY = tableTop + 30;
  let subtotal = 0;
  let totalGST = 0;

  order.orderItems.forEach((item, index) => {
    const quantity = item.quantity;
    
    // The item.price might already include GST or be base price
    // Let's work backwards from the total to ensure accuracy
    let unitPrice, gstAmount, lineTotal;
    
    if (item.gstAmount && item.gstAmount > 0) {
      // If GST amount is stored, use it
      gstAmount = item.gstAmount;
      // Calculate the base price excluding GST
      const totalItemAmount = item.price * quantity;
      lineTotal = totalItemAmount - gstAmount;
      unitPrice = lineTotal / quantity;
    } else {
      // If no GST amount stored, assume item.price is base price
      unitPrice = item.price;
      lineTotal = unitPrice * quantity;
      gstAmount = lineTotal * 0.18; // 18% GST
    }
    
    subtotal += lineTotal;
    totalGST += gstAmount;

    // Display amount is line total + GST
    const displayAmount = lineTotal + gstAmount;

    // Add item with proper column spacing
    doc.fontSize(10)
       .text(item.name, 50, currentY, { width: 280 })
       .text(quantity.toString(), 340, currentY, { width: 30, align: 'center' })
       .text(`${unitPrice.toFixed(2)}`, 390, currentY, { width: 50, align: 'right' })
       .text(`${gstAmount.toFixed(2)}`, 460, currentY, { width: 40, align: 'right' })
       .text(`${displayAmount.toFixed(2)}`, 520, currentY, { width: 50, align: 'right' });
    
    currentY += 30;
  });

  // Add line above totals
  currentY += 10;
  doc.moveTo(450, currentY)
     .lineTo(570, currentY)
     .stroke();

  // Add totals with better alignment - ensure they match the order total
  currentY += 20;
  
  // Ensure our calculations match the order total exactly
  // Total should be: subtotal + totalGST + shipping = order.totalPrice
  const calculatedTotal = subtotal + totalGST + order.shippingPrice;
  
  // If there's a discrepancy, adjust the subtotal to make it balance
  if (Math.abs(calculatedTotal - order.totalPrice) > 0.01) {
    subtotal = order.totalPrice - totalGST - order.shippingPrice;
  }
  
  doc.fontSize(11)
     .text('Subtotal:', 450, currentY)
     .text(`${subtotal.toFixed(2)}`, 520, currentY, { width: 50, align: 'right' });

  currentY += 15;
  doc.text('GST (18%):', 450, currentY)
     .text(`${totalGST.toFixed(2)}`, 520, currentY, { width: 50, align: 'right' });

  currentY += 15;
  doc.text('Shipping:', 450, currentY)
     .text(`${order.shippingPrice.toFixed(2)}`, 520, currentY, { width: 50, align: 'right' });

  // Add gap after shipping and before total
  currentY += 20;
  doc.moveTo(450, currentY)
     .lineTo(570, currentY)
     .stroke();

  currentY += 15;
  doc.fontSize(12)
     .fillColor('#000')
     .text('Total Amount:', 450, currentY)
     .text(`${order.totalPrice.toFixed(2)}`, 520, currentY, { width: 50, align: 'right' });

  // Add footer
  const footerY = 650;
  doc.fontSize(10)
     .text('Thank you for shopping with SastaKart!', 50, footerY)
     .text('For any queries, contact us at support@sastakart.com', 50, footerY + 15)
     .text('This is a computer-generated invoice and does not require signature.', 50, footerY + 30);

  // Add GST information if available and has meaningful data
  if (order.gstSummary && order.gstSummary.categoryWiseGst && Object.keys(order.gstSummary.categoryWiseGst).length > 0) {
    const validGstEntries = Object.entries(order.gstSummary.categoryWiseGst).filter(([category, amount]) => {
      const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
      return numericAmount > 0 && category !== 'parent' && category.trim() !== '';
    });

    if (validGstEntries.length > 0) {
      doc.fontSize(9)
         .text('GST Breakdown by Category:', 50, footerY + 50);
      
      let gstY = footerY + 65;
      validGstEntries.forEach(([category, amount]) => {
        const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
        doc.fontSize(8)
           .text(`${category}: ${numericAmount.toFixed(2)}`, 50, gstY);
        gstY += 12;
      });
    }
  }
}

module.exports = {
  generateInvoice
};
