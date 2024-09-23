import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const UserOrders = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the order when the component mounts
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get('/user/getorder', { withCredentials: true });
        setOrder(response.data); 
      console.log(response.data)
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order data');
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const handleCancelOrder = (productId) => {
    // Handle canceling order logic here
    console.log('Cancel order for product:', productId);
  };

  const handleReturnOrder = (productId) => {
    // Handle returning order logic here
    console.log('Return product:', productId);
  };

  if (loading) {
    return <div className="p-4 max-w-4xl mx-auto">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 max-w-4xl mx-auto text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="border p-4 mb-4 rounded">
        <div className="flex justify-between mb-2">
          <div>
            <p>Order ID: {order._id}</p>
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>
              Ship To: {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold">Total: ₹{order.totalPrice.toLocaleString()}</p>
            <p>
              Status:{' '}
              <span
                className={`font-bold ${
                  order.orderStatus === 'Completed'
                    ? 'text-green-600'
                    : order.orderStatus === 'Cancelled'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {order.orderStatus}
              </span>
            </p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Payment Status: {order.paymentStatus}</p>
          </div>
        </div>
      </div>

      {/* Product List */}
      <h2 className="text-xl font-bold mb-2">Products</h2>
      {order.products.map((product) => (
        <div key={product._id} className="border p-4 mb-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{product.name}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ₹{product.price.toLocaleString()}</p>
              <p>Status: {product.status}</p>
            </div>
            <div>
              {product.status === 'Ordered' && (
                <>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleReturnOrder(product._id)}
                  >
                    Return product
                  </button>
                  <button
                    className="border border-gray-300 px-4 py-2 rounded"
                    onClick={() => handleCancelOrder(product._id)}
                  >
                    Cancel order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Last Updated */}
      <div className="mt-4">
        <p>
          <strong>Last Updated On:</strong> {new Date(order.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UserOrders;
