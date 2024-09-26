import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utils/axios';
import { FaEye, FaEdit, FaSpinner } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import { BiUser } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/admin/getorders", { withCredentials: true });
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/admin/vieworderdetails/${orderId}`);
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setIsModalOpen(true);
  };

  const handleEditOrder = async () => {
    try {
      await api.patch(`/admin/orders/${selectedOrder._id}`, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
      });

  
      setSuccessMessage("Order updated successfully!");
  
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      setOrders(orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, orderStatus: newStatus, paymentStatus: newPaymentStatus } 
          : order
      ));
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("There was an error updating the order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h2>
      {successMessage && ( 
        <div className="bg-green-200 text-green-800 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order._id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex items-center">
                    <BiUser className="text-gray-500 mr-2" />
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.user?.name} ({order.user?.email})
                    </p>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex items-center">
                    <MdAttachMoney className="text-green-500 mr-1" />
                    <p className="text-gray-900 whitespace-no-wrap">{order.totalPrice}</p>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.orderStatus === 'Completed' ? 'bg-green-200 text-green-800' :
                    order.orderStatus === 'Processing' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'Paid' ? 'bg-green-200 text-green-800' :
                    order.paymentStatus === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEye className="text-xl" />
                    </button>
                    <button
                      onClick={() => openEditModal(order)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Edit Order</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Order Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Payment Status</label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
