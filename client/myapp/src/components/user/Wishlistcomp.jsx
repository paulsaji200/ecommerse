import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';


const WishlistPage = ({ wishlist, available, removeFromWishlist, addToCart }) => {
  const navigate = useNavigate();

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Nav />
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600">Start adding items to your wishlist!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-24 max-w-6xl mx-auto">
      <Nav />
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">YOUR WISHLIST</h2>
        <p className="mb-4">Total {wishlist.products.length} Items In Your Wishlist</p>
        {wishlist.products.map((item) => {
          const stock = available[item.productId._id] || 0;

          return (
            <div key={item.productId._id} className="flex items-center gap-4 border-b py-4">
              <img
                src={item.productId.images[0]}
                alt={item.productId.productName}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-blue-600">{item.productId.productName}</h3>
                <p className="text-sm text-gray-600">Category: {item.productId.category}</p>
                <p className="font-bold">₹ {item.productId.salePrice.toLocaleString()}</p>
                {stock === 0 ? (
                  <p className="text-red-500 font-bold">Out of Stock</p>
                ) : (
                  <p className="text-green-500">In Stock</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`py-2 px-4 rounded ${
                    stock > 0
                      ? 'bg-purple-800 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  onClick={() => addToCart(item.productId._id)}
                  disabled={stock === 0}
                >
                  <ShoppingCart className="inline-block mr-2" size={16} />
                  Add to Cart
                </button>
                <Trash2
                  className="text-gray-500 cursor-pointer"
                  onClick={() => removeFromWishlist(item.productId._id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;