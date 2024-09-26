import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersasync } from '../../redux/user/getordres';

const UserOrders = () => {
  const [loading, setLoading] = useState(true);
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("svbghwevbh ")
       dispatch(getOrdersasync());
      setLoading(false);
    };
    fetchOrders();
  }, [dispatch]);

  const handleCancelOrder = (orderId, productId) => {
   dispatch()
  };

  const handleReturnOrder = (orderId, productId) => {
    console.log('Return product:', productId, 'in order:', orderId);
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded">
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
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Payment Status: {order.paymentStatus}</p>
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
                  {['Ordered', 'Shipped'].includes(product.status) && (
                    <button
                      className="border border-gray-300 px-4 py-2 rounded"
                      onClick={() => handleCancelOrder(order._id, product._id)}
                    >
                      Cancel order
                    </button>
                  )}
                  {product.status === 'Delivered' && (
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleReturnOrder(order._id, product._id)}
                    >
                      Return product
                    </button>
                  )}
                  {product.status === 'Cancelled' && (
                    <p className="text-red-600 font-bold">Cancelled</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <p>
              <strong>Last Updated On:</strong> {new Date(order.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
