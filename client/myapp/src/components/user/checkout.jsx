import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartAsync } from '../../redux/user/Cart';// Adjust the import based on your action file
import api from '../../utils/axios'; // Adjust this based on your API configuration

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart); // Fetch cart data from Redux state
  const [addresses, setAddresses] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    dispatch(getCartAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/user/getaddress", { withCredentials: true });
        setAddresses(response.data);
        
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (cart && cart.products) {
      setSubtotal(cart.totalPrice); // Use totalPrice directly if provided
      const calculatedGst = cart.totalPrice * 0.18; // Calculate GST based on total price
      setGstAmount(calculatedGst);
      setTotal(cart.totalPrice + calculatedGst); // Total with GST
    }
  }, [cart]);

  // Handle address change
  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    const selected = addresses.find(addr => addr._id === selectedId);
    setSelectedAddress(selected);
  };

  // Handle payment method change
  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert("Please select a delivery address and payment method.");
      return;
    }

    try {
      const orderData = {
        address: {
          street: selectedAddress.address,   // Assuming selectedAddress contains full address details
          city: selectedAddress.city,
          postalCode: selectedAddress.pincode,
          country: selectedAddress.state // Assuming 'state' is used as country here
        },
        paymentMethod: selectedPayment,
        products: cart.products.map((item) => ({
          productId: item.productId._id,   
          name: item.name,         
          quantity: item.quantity,
          price: item.price      
        })),
        totalPrice: total, // Assuming total is the final price after taxes
      };
    

      console.log(orderData)
      const response = await api.post("/user/createorder",{orderData:orderData}, { withCredentials: true });
      alert("Order placed successfully!");
      // Optionally redirect or clear cart here
    } catch (error) {
      console.error("Failed to place order", error);
      alert("Failed to place the order. Please try again.");
    }
    
  }

  // Early return if cart is empty or not loaded
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty. Please add items to your cart before proceeding.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-4xl mx-auto">
      <div className="md:w-2/3 pr-4">
        <h1 className="text-2xl font-bold mb-4">CHECKOUT</h1>
        <div className="flex mb-4">
          {cart.products.map((item) => (
            <img
              key={item.productId._id}
              src={item.productId.images[0]} // Assuming images array exists
              alt={item.productId.name}
              className="mr-2 w-16 h-16 object-cover"
            />
          ))}
        </div>
        <p className="text-green-600 mb-4">
          Arrives By {new Date().toLocaleDateString()} {/* Update this to your actual delivery estimate */}
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
          {["Debit Card / Credit Card", "UPI Method", "Internet Banking", "Wallet", "Cash on Delivery"].map((method, index) => (
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
                {method === "Cash on Delivery" && (
                  <span className="mr-2">🚚</span> // Replace with a Truck icon if available
                )}
                {method}
              </label>
            </div>
          ))}
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
          <div className="flex justify-between mb-2">
            <span>GST Amount</span>
            <span>₹{gstAmount.toLocaleString()}</span>
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
