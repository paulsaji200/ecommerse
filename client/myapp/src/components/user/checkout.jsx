import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartAsync } from '../../redux/user/Cart';
import api from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../global/Nav';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const [addresses, setAddresses] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    dispatch(getCartAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/user/getaddress', { withCredentials: true });
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch addresses', error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (cart && cart.products) {
      setSubtotal(cart.totalPrice);
      setTotal(cart.totalPrice); 
    }
  }, [cart]);

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    const selected = addresses.find((addr) => addr._id === selectedId);
    setSelectedAddress(selected);
  };

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert('Please select a delivery address and payment method.');
      return;
    }

    try {
      const orderData = {
        address: {
          street: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.pincode,
          country: selectedAddress.state,
        },
        paymentMethod: selectedPayment,
        products: cart.products.map((item) => ({
          productId: item.productId._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
      };

      console.log(orderData);
      await api.post('/user/createorder', { orderData }, { withCredentials: true });

      setOrderSuccess(true);
      await api.delete("/user/clearcart", { withCredentials: true });

      setTimeout(() => {
        setOrderSuccess(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error('Failed to place order', error);
      alert('Failed to place the order. Please try again.');
    }
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty. Please add items to your cart before proceeding.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row p-24 max-w-4xl mx-auto">
      <Nav />
      <div className="md:w-2/3 pr-4 mt-8"> {/* Increased margin-top */}
        <h1 className="text-2xl font-bold mb-4">CHECKOUT</h1>

        {orderSuccess && (
          <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">
            Order placed successfully!
          </div>
        )}

        <div className="flex mb-4">
          {cart.products.map((item) => (
            <img
              key={item.productId._id}
              src={item.productId.images[0]}
              alt={item.productId.name}
              className="mr-2 w-16 h-16 object-cover"
            />
          ))}
        </div>
        <p className="text-green-600 mb-4">
          Arrives By {new Date().toLocaleDateString()}
        </p>
        <div className="mb-4">
          <h2 className="font-bold">Delivery Address</h2>
          <select
            className="w-full p-2 border rounded mb-2"
            value={selectedAddress ? selectedAddress._id : ''}
            onChange={handleAddressChange}
          >
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.name} - {addr.location}
              </option>
            ))}
          </select>
          {selectedAddress && (
            <>
              <p>{selectedAddress.name}</p>
              <p>{selectedAddress.location}</p>
              <p>{selectedAddress.pincode}</p>
              <p>Mobile: {selectedAddress.mobile}</p>
            </>
          )}
        </div>
        <div className="mb-4">
          <h2 className="font-bold">Payment Method</h2>
          {['Debit Card / Credit Card', 'UPI Method', 'Internet Banking', 'Wallet', 'Cash on Delivery'].map(
            (method, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`payment-${index}`}
                  name="payment"
                  value={method}
                  checked={selectedPayment === method}
                  onChange={() => handlePaymentChange(method)}
                  className="mr-2"
                />
                <label htmlFor={`payment-${index}`} className="flex items-center">
                  {method === 'Cash on Delivery' && <span className="mr-2">🚚</span>}
                  {method}
                </label>
              </div>
            )
          )}
        </div>
        <button onClick={handlePlaceOrder} className="bg-red-800 text-white px-4 py-2 rounded">
          Place Order
        </button>
      </div>
      <div className="md:w-1/3 mt-4 md:mt-0">
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">ORDER SUMMARY</h2>
          <div className="flex justify-between mb-2">
            <span>{cart.products.length} ITEMS</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Charges</span>
            <span>Free</span>
          </div>
         
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <button onClick={handlePlaceOrder} className="bg-red-800 text-white px-4 py-2 rounded w-full mt-4">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
