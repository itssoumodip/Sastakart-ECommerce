import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Mail, Phone, Truck, Package, Clock, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/auth';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const ORDER_STATUSES = {
    'Pending': { 
      label: 'Pending',
      icon: Clock,
      color: 'yellow',
      description: 'Order has been placed but not yet processed'
    },
    'Processing': {
      label: 'Processing',
      icon: Package,
      color: 'blue',
      description: 'Order is being processed and packed'
    },
    'Out_For_Delivery': {
      label: 'Out For Delivery',
      icon: Truck,
      color: 'indigo',
      description: 'Order is with the delivery partner'
    },
    'Delivered': {
      label: 'Delivered',
      icon: CheckCircle,
      color: 'green',
      description: 'Order has been delivered successfully'
    },
    'COD_Pending': {
      label: 'COD Pending',
      icon: Clock,
      color: 'purple',
      description: 'Waiting for Cash on Delivery payment'
    },
    'COD_Collected': {
      label: 'COD Collected',
      icon: CheckCircle,
      color: 'teal',
      description: 'Cash on Delivery payment collected'
    },
    'Cancelled': {
      label: 'Cancelled',
      icon: AlertTriangle,
      color: 'red',
      description: 'Order has been cancelled'
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/admin/order/${id}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (newStatus) => {
    if (!statusNote.trim()) {
      toast.error('Please add a note about this status change');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/admin/order/${id}/status`,
        {
          status: newStatus,
          note: statusNote
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setOrder(response.data.order);
        toast.success(`Order status updated to ${ORDER_STATUSES[newStatus].label}`);
        setStatusNote('');
        setSelectedStatus('');
        setShowStatusModal(false);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleCODCollection = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/admin/order/${id}/collect-cod`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        toast.success('COD payment collected successfully');
        fetchOrderDetails(); // Refresh order details
      }
    } catch (error) {
      console.error('Error collecting COD:', error);
      toast.error(error.response?.data?.message || 'Failed to collect COD payment');
    }
  };

  const getNextAvailableStatuses = (currentStatus) => {
    const statusFlow = {
      'Pending': ['Processing', 'Cancelled'],
      'Processing': ['Out_For_Delivery', 'Cancelled'],
      'Out_For_Delivery': ['Delivered', 'Cancelled'],
      'COD_Pending': ['Processing', 'COD_Collected', 'Cancelled'],
      'COD_Collected': ['Processing', 'Out_For_Delivery'],
      'Delivered': [], // No further transitions
      'Cancelled': [] // No further transitions
    };
    
    return statusFlow[currentStatus] || [];
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
        <title>{`Order ${order?.id || ''}`} | Admin</title>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order?._id?.toString().slice(-8) || 'N/A'}</h1>
          <p className="text-gray-600 mt-1">
            Placed on {new Date(order?.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div><div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className={`inline-flex items-center px-4 py-2 rounded-lg 
              ${ORDER_STATUSES[order?.orderStatus]?.color === 'green' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-600 text-white hover:bg-blue-700'} 
              transition-colors`}
          >            {order?.orderStatus && ORDER_STATUSES[order.orderStatus] && (
              <span className="mr-2">
                {React.createElement(ORDER_STATUSES[order.orderStatus].icon, { 
                  className: "h-5 w-5" 
                })}
              </span>
            )}
            Update Status
          </button>

          {/* COD Collection Button */}
          {order?.paymentMethod === 'cod' && order?.orderStatus === 'COD_Pending' && (
            <button
              onClick={handleCODCollection}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Collect COD
            </button>
          )}

          <button 
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status
                </label>
                <div className="text-sm text-gray-600 mb-2">
                  {ORDER_STATUSES[order?.orderStatus]?.label}
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select new status...</option>
                  {getNextAvailableStatuses(order?.orderStatus).map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUSES[status]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Note *
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change..."
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedStatus('');
                    setStatusNote('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedStatus)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedStatus || !statusNote.trim()}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status History */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Status History</h2>
            </div>
            <div className="p-6">
              <div className="flow-root">                <ul className="-mb-8">
                  {(order?.statusHistory || []).map((status, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== order.statusHistory.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white 
                              ${status.status === 'Delivered' || status.status === 'COD_Collected' ? 'bg-green-100' :
                                status.status === 'Cancelled' ? 'bg-red-100' :
                                status.status === 'Out_For_Delivery' ? 'bg-indigo-100' :
                                status.status === 'COD_Pending' ? 'bg-purple-100' :
                                'bg-blue-100'}`}
                            >                              {ORDER_STATUSES[status.status] && (
                                <span className={`h-5 w-5 
                                  ${status.status === 'Delivered' || status.status === 'COD_Collected' ? 'text-green-600' :
                                    status.status === 'Cancelled' ? 'text-red-600' :
                                    status.status === 'Out_For_Delivery' ? 'text-indigo-600' :
                                    status.status === 'COD_Pending' ? 'text-purple-600' :
                                    'text-blue-600'}`}
                                >
                                  {ORDER_STATUSES[status.status]?.icon && React.createElement(ORDER_STATUSES[status.status].icon, { 
                                    className: "h-5 w-5" 
                                  })}
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">
                                  {ORDER_STATUSES[status.status]?.label || status.status}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                {status.note}
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              {new Date(status.timestamp).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column - Items and Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>            <div className="divide-y divide-gray-200">
              {order.orderItems?.map((item, index) => (
                <div key={item._id || index} className="p-6 flex items-center">
                  <div className="h-15 w-15 overflow-hidden flex-shrink-0 rounded-lg border border-gray-200">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Product ID: {item.product?.toString() || item._id?.toString() || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">₹{item.price?.toFixed(2)} × {item.quantity}</div>
                    <div className="font-semibold text-gray-900">₹{(item.price * item.quantity)?.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>            <div className="p-6">              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{order.shippingPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="text-gray-900">₹{order.taxPrice?.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{order.totalPrice?.toFixed(2)}</span>
                  </div>
                  {order.paymentMethod === 'cod' && (
                    <div className="flex justify-between text-sm text-purple-600 mt-1">
                      <span>Payment Method</span>
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                  )}
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
            </div>            <div className="p-6">
              <h3 className="font-medium text-gray-900">{order.user?.name}</h3>
              <div className="mt-4 space-y-2">
                <a 
                  href={`mailto:${order.user?.email}`} 
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {order.user?.email}
                </a>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {order.shippingInfo?.phoneNo}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>            <div className="p-6">
              <div className="space-y-1 text-gray-700">
                <p>{order.shippingInfo?.address}</p>
                <p>
                  {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}
                </p>
                <p>{order.shippingInfo?.country}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>            <div className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="text-gray-900 capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                  </span>
                </div>
                {order.paymentInfo?.id && order.paymentMethod !== 'cod' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="text-gray-900 text-sm">{order.paymentInfo.id}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    order.paymentInfo?.status === 'succeeded' 
                      ? 'bg-green-100 text-green-800' 
                      : order.paymentMethod === 'cod' && order.orderStatus === 'COD_Collected'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentMethod === 'cod'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentInfo?.status === 'succeeded' 
                      ? 'Paid' 
                      : order.paymentMethod === 'cod' && order.orderStatus === 'COD_Collected'
                      ? 'Collected'
                      : order.paymentMethod === 'cod'
                      ? 'Pending'
                      : order.paymentInfo?.status || 'Pending'}
                  </span>
                </div>
                {order.paymentMethod === 'cod' && order.codCollectedAt && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Collected At</span>
                    <span>{new Date(order.codCollectedAt).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
