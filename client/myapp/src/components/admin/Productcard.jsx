
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../redux/user/Cart';
import { useState,useEffect } from 'react';
import api from '../../utils/axios';
import { useSelector } from 'react-redux';
import { fetchAllProducts } from '../../redux/user/getProduct';
import { selectProducts } from '../../redux/user/getProduct';
import { selectError } from '../../redux/user/getProduct';
import { selectLoading } from '../../redux/user/getProduct';
import { fetchProducts } from '../../redux/user/getProduct';
import SidebarFilter from '../user/sorting';
import Nav from '../global/Nav';
export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Using local state to track which product has been added to the cart
  const [addedToCart, setAddedToCart] = useState({});

  // Handle adding product to cart and toggle button to "Go to Cart"
  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    dispatch(addToCartAsync(product));
    setAddedToCart(prevState => ({ ...prevState, [product._id]: true }));  // Set product as added
  };

  // Handle navigation to product details
  const handleCardClick = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  // Handle navigation to the cart
  const goToCart = (event) => {
    event.stopPropagation();
    navigate('/cart');  // Assuming your cart route is '/cart'
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {product.map((productItem) => (
        <div
          key={productItem._id}
          className="w-64 h-auto rounded overflow-hidden shadow-lg bg-white p-4 flex flex-col mb-12"
          onClick={() => handleCardClick(productItem._id)}  // Navigate to product details on card click
        >
          <img
            className="w-full h-60 object-cover"
            src={productItem.images[0] || 'https://via.placeholder.com/150'}
            alt={productItem.name || 'Product Image'}
          />
          <div className="flex-grow px-2 py-1">
            <div className="font-bold text-lg mb-1 truncate">{productItem.productName || 'Product Name'}</div>
            <p className="text-gray-700 text-sm line-clamp-2">{productItem.description || 'Product description goes here.'}</p>
            <div className="mt-2 flex items-center">
              <span className="text-gray-900 font-bold text-base">${productItem.salePrice || '0.00'}</span>
              {productItem.productPrice && (
                <span className="text-red-500 text-xs ml-2 line-through">${productItem.productPrice || '0.00'}</span>
              )}
            </div>
            <div className="mt-2 flex items-center">
              <span className={`inline-block ${productItem.quantity > 0 ? 'bg-green-200' : 'bg-red-200'} rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2`}>
                {productItem.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="inline-block bg-yellow-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                {productItem.rating ? `${productItem.rating} ★` : '4.0 ★'}
              </span>
            </div>
          </div>
          <div className="px-2 py-2">
            {addedToCart[productItem._id] ? (
              <button
                className="bg-green-500 text-white font-bold py-1 px-2 rounded hover:bg-green-700 w-full text-sm"
                onClick={goToCart}  // Navigate to the cart
              >
                Go to Cart
              </button>
            ) : (
              <button
                className={`bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-700 w-full text-sm ${productItem.quantity === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={productItem.quantity === 0}
                onClick={(event) => handleAddToCart(event, productItem)}  // Add product to cart
              >
                {productItem.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};


export const Productcomp = () => {
 

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
 
  const loading = useSelector(selectLoading);

  useEffect(() => {
    console.log('Fetching all products');
    dispatch(fetchAllProducts());
   
  }, [dispatch]);

 

 

  console.log('Loading:', loading);
  console.log('Products:', products); // Log the products array

  return (
    <div className="flex">
      <div className="flex-grow">
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(products) && products.length > 0 ? (
         
            <ProductCard product={products} /> // Ensure each product has a unique id
          )
         : (
          <div>No products available</div>
        )}
      </div>
    </div>
  );
};


export default Productcomp