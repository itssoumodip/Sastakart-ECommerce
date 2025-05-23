import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';

// Mock data - would be fetched from API in real implementation
const MOCK_ORDERS = [
  {
    id: '1234',
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    items: [
      { id: '1', name: 'Black T-shirt', quantity: 2, price: 29.99 },
      { id: '3', name: 'Denim Jacket', quantity: 1, price: 89.99 }
    ],
    total: 149.97,
    status: 'Processing',
    date: '2025-05-15T14:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: '1235',
    user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    items: [
      { id: '2', name: 'White Sneakers', quantity: 1, price: 79.99 },
    ],
    total: 79.99,
    status: 'Delivered',
    date: '2025-05-10T09:15:00Z',
    shippingAddress: {
      street: '456 Pine Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    paymentMethod: 'PayPal'
  },
  {
    id: '1236',
    user: { id: '3', name: 'Robert Johnson', email: 'robert@example.com' },
    items: [
      { id: '4', name: 'Gray Sweatpants', quantity: 1, price: 39.99 },
      { id: '5', name: 'Leather Belt', quantity: 1, price: 24.99 },
      { id: '6', name: 'Sunglasses', quantity: 2, price: 19.99 }
    ],
    total: 104.96,
    status: 'Shipped',
    date: '2025-05-12T16:45:00Z',
    shippingAddress: {
      street: '789 Oak Drive',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'USA'
    },
    paymentMethod: 'Credit Card'
  }
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order #${orderId} updated to ${newStatus}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Filter:</span>
          <select 
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.user.name}</td>
                    <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Order Details #{selectedOrder.id}</h2>
                    <button 
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() => setSelectedOrder(null)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <p>{selectedOrder.user.name}</p>
                      <p>{selectedOrder.user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Product</th>
                          <th className="py-2 text-left">Quantity</th>
                          <th className="py-2 text-left">Price</th>
                          <th className="py-2 text-left">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-3">{item.name}</td>
                            <td className="py-3">{item.quantity}</td>
                            <td className="py-3">${item.price.toFixed(2)}</td>
                            <td className="py-3">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t">
                          <td colSpan="3" className="py-3 text-right font-semibold">
                            Total:
                          </td>
                          <td className="py-3 font-semibold">
                            ${selectedOrder.total.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Payment Information</h3>
                    <p>Method: {selectedOrder.paymentMethod}</p>
                    <p>Status: Paid</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <p className="mr-2">
                      <span className="font-semibold">Current Status: </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    
                    <select 
                      className="border border-gray-300 rounded px-3 py-2"
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    <Button variant="primary">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
