import React, { useState, useEffect } from 'react';
import { FcApproval, FcCancel } from "react-icons/fc";
import ReactPaginate from 'react-paginate';
import api from '../../utils/axios';

const OrderManagement = () => {
  const [orderData, setOrderData] = useState([]); // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 10;
  const offset = currentPage * ordersPerPage;

  
    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await api.get("/admin/getorders", { withCredentials: true });
            console.log(response.data.data)
            // Access the nested 'data' inside the response object
            setOrderData(response.data.data); // Correctly extract the orders array
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        };
      
        fetchOrders();
      }, []);
      
  
  const paginatedOrders = orderData && Array.isArray(orderData) ? orderData.slice(offset, offset + ordersPerPage) : [];
  const pageCount = orderData && Array.isArray(orderData) ? Math.ceil(orderData.length / ordersPerPage) : 0;
  

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-pink-100">
      <div className="bg-white rounded p-4 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>

        <div className="overflow-auto flex-grow">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Reference No.</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Payment</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
  {paginatedOrders.map((order) => (
    <tr key={order.id}>
      <td className="py-2 px-4 border-b">{order.id}</td>
      <td className="py-2 px-4 border-b">{order.referenceNo}</td>
      <td className="py-2 px-4 border-b">
        {order.amount ? `$${order.amount.toFixed(2)}` : 'N/A'}
      </td>
      <td className="py-2 px-4 border-b">{order.payment}</td>
      <td className="py-2 px-4 border-b">
        {order.status === 'Paid' ? (
          <span className="flex items-center">
            <FcApproval className="mr-2" /> Paid
          </span>
        ) : (
          <span className="flex items-center">
            <FcCancel className="mr-2" /> Unpaid
          </span>
        )}
      </td>
      <td className="py-2 px-4 border-b">
        <button className="bg-green-500 text-white p-2 rounded w-20">
          details
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex space-x-2"}
            activeClassName={"bg-blue-500 text-white"}
            pageClassName={"p-2 bg-gray-200 rounded"}
            previousClassName={"p-2 bg-gray-200 rounded"}
            nextLabel={"p-2 bg-gray-200 rounded"}
            breakClassName={"p-2 bg-gray-200 rounded"}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
