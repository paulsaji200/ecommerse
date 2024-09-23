import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartAsync, getCartAsync, addQuantity } from '../../redux/user/Cart';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [total, setTotal] = useState(0);

  const handleQuantityChange = async (product_id, quantity) => {
    try {
      await dispatch(addQuantity({ product_id, quantity })).unwrap();
     
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteCartAsync(productId)).unwrap();
      
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  useEffect(() => {
    console.log("dissss")
    dispatch(getCartAsync());
  }, [dispatch]);

  useEffect(() => {
    if (cart) {
      const calculatedSubtotal = cart.products.reduce(
        (acc, item) => acc + item.productId.productPrice * item.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);
      const calculatedGst = calculatedSubtotal * 0.18;
      setGstAmount(calculatedGst);
      setTotal(calculatedSubtotal + calculatedGst);
    }
  }, [cart]);

  if (!cart || cart.products.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">YOUR CART</h2>
        <p className="mb-4">Total {cart.products.length} Items In Your Cart</p>
        {cart.products.map((item) => (
          <div key={item.productId._id} className="flex items-center gap-4 border-b py-4">
            <img
              src={item.productId.images[0]}
              alt={item.productId.productName}
              className="w-24 h-24 object-cover"
            />
            <div className="flex-grow">
              <h3 className="font-bold text-blue-600">{item.productId.productName}</h3>
              <p className="text-sm text-gray-600">Category: {item.productId.category}</p>
              <p className="font-bold">₹ {item.productId.productPrice.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border p-1"
                defaultValue={item.quantity}
                onChange={(e) => handleQuantityChange(item.productId._id, e.target.value)}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index} value={index + 1}>{index + 1}</option>
                ))}
              </select>
              <Trash2
                className="text-gray-500 cursor-pointer"
                onClick={() => handleDelete(item.productId._id)}
              />
            </div>
          </div>
        ))}
        <button className="bg-purple-800 text-white py-2 px-4 mt-4 w-full">Checkout</button>
      </div>

      <div className="w-full md:w-80">
        <div className="bg-gray-100 p-4">
          <h3 className="font-bold mb-2">ORDER SUMMARY</h3>
          <div className="flex justify-between mb-2">
            <span>{cart.products.length} ITEMS</span>
            <span>₹ {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>GST Amount</span>
            <span>₹ {gstAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>TOTAL</span>
            <span>₹ {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

