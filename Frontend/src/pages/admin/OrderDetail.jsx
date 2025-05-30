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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black border-2 border-white text-white px-6 py-4">
          Order not found. The order may have been deleted or the ID is invalid.
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-white hover:underline font-mono uppercase"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <Helmet>
        <title>{`Order ${order.id}`} | Admin</title>
      </Helmet>

      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center text-white hover:text-gray-300 font-mono uppercase"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Orders
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-widest uppercase">[ ORDER {order.id} ]</h1>
          <p className="text-gray-400 mt-1 font-mono">Placed on {order.date}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={order.status}
            onChange={handleStatusChange}
            className="border-2 border-white py-2 px-3 bg-black text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button 
            className="flex items-center gap-1 border-2 border-white py-2 px-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-mono uppercase"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Items and Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-black border-4 border-white overflow-hidden">
            <div className="p-6 border-b-2 border-white">
              <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">[ ORDER ITEMS ]</h2>
            </div>

            <div className="divide-y-2 divide-white">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="h-15 w-15 overflow-hidden flex-shrink-0 border-2 border-white">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-white font-mono uppercase">{item.name}</h3>
                    <p className="text-sm text-gray-400 font-mono">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-medium">${item.price.toFixed(2)} × {item.quantity}</div>
                    <div className="font-bold">${item.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-black border-4 border-white overflow-hidden">
            <div className="p-6 border-b-2 border-white">
              <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">[ ORDER SUMMARY ]</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase">Shipping</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 uppercase">Discount</span>
                    <span className="text-white">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-white pt-3 mt-3">
                  <div className="flex justify-between font-bold text-base">
                    <span className="uppercase">Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-8">
          {/* Customer Information */}
          <div className="bg-black border-4 border-white overflow-hidden">
            <div className="p-6 border-b-2 border-white">
              <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">[ CUSTOMER ]</h2>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-white font-mono uppercase">{order.customer.name}</h3>
              <div className="mt-4 space-y-2 font-mono">
                <a 
                  href={`mailto:${order.customer.email}`} 
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {order.customer.email}
                </a>
                <a 
                  href={`tel:${order.customer.phone}`} 
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {order.customer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-black border-4 border-white overflow-hidden">
            <div className="p-6 border-b-2 border-white">
              <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">[ SHIPPING ADDRESS ]</h2>
            </div>
            <div className="p-6">
              <div className="space-y-1 font-mono text-gray-300">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-white">
                <h3 className="font-medium text-white font-mono uppercase mb-2">Shipping Method</h3>
                <p className="text-gray-400 font-mono">{order.shipping.method}</p>
                <p className="text-gray-400 font-mono">Tracking: {order.shipping.trackingNumber}</p>
                <p className="text-gray-400 font-mono">Est. Delivery: {order.shipping.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-black border-4 border-white overflow-hidden">
            <div className="p-6 border-b-2 border-white">
              <h2 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">[ PAYMENT INFORMATION ]</h2>
            </div>
            <div className="p-6 font-mono">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 uppercase">Method</span>
                  <span className="text-white">{order.payment.method}</span>
                </div>
                {order.payment.cardLast4 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 uppercase">Card</span>
                    <span className="text-white">**** **** **** {order.payment.cardLast4}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white">
                  <span className="text-gray-400 uppercase">Status</span>
                  <span className="bg-white text-black px-2 font-bold uppercase">{order.payment.status}</span>
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
