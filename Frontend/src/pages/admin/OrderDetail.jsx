import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // In a real application, fetch order data from API
    // For demo purposes, we'll use mock data after a brief delay
    const timer = setTimeout(() => {
      setOrder({
        id: 'ORD-1234',
        date: '2023-11-28',
        customer: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567'
        },
        shippingAddress: {
          line1: '123 Main Street',
          line2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States'
        },
        billingAddress: {
          line1: '123 Main Street',
          line2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States'
        },
        payment: {
          method: 'Credit Card',
          cardLast4: '4242',
          status: 'Paid'
        },
        shipping: {
          method: 'Standard Shipping',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2023-12-02',
          status: 'Delivered'
        },
        items: [
          {
            id: 1,
            name: 'Wireless Headphones',
            sku: 'PRD-0001',
            price: 99.99,
            quantity: 1,
            total: 99.99,
            image: 'https://placehold.co/60x60'
          },
          {
            id: 2,
            name: 'Bluetooth Speaker',
            sku: 'PRD-0003',
            price: 79.99,
            quantity: 1,
            total: 79.99,
            image: 'https://placehold.co/60x60'
          }        ],
        status: 'Delivered',
        subtotal: 179.98,
        shippingCost: 5.99,
        tax: 14.40,
        discount: 17.99,
        total: 182.38
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setOrder({ ...order, status: newStatus });
    toast.success(`Order status updated to ${newStatus}`);
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm text-gray-900 px-6 py-4">
          Order not found. The order may have been deleted or the ID is invalid.
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-blue-600 hover:text-blue-700 hover:underline"
        >
          Return to Orders
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Helmet>
        <title>{`Order ${order.id}`} | Admin</title>
      </Helmet>

      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Orders
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
          <p className="text-gray-600 mt-1">Placed on {order.date}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={order.status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">        {/* Left Column - Items and Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="h-15 w-15 overflow-hidden flex-shrink-0 rounded-lg border border-gray-200">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">${item.price.toFixed(2)} × {item.quantity}</div>
                    <div className="font-semibold text-gray-900">${item.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Right Column - Customer Info */}
        <div className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-gray-900">{order.customer.name}</h3>
              <div className="mt-4 space-y-2">
                <a 
                  href={`mailto:${order.customer.email}`} 
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {order.customer.email}
                </a>
                <a 
                  href={`tel:${order.customer.phone}`} 
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {order.customer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="p-6">
              <div className="space-y-1 text-gray-700">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Method</h3>
                <p className="text-gray-600">{order.shipping.method}</p>
                <p className="text-gray-600">Tracking: {order.shipping.trackingNumber}</p>
                <p className="text-gray-600">Est. Delivery: {order.shipping.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="text-gray-900">{order.payment.method}</span>
                </div>
                {order.payment.cardLast4 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card</span>
                    <span className="text-gray-900">**** **** **** {order.payment.cardLast4}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">{order.payment.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
