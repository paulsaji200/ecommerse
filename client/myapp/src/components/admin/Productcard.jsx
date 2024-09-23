import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../redux/user/Cart';



const ProductCard = ({ product }) => {
const dispatch = useDispatch();


  const navigate = useNavigate();


  const handleAddToCart = (product) => {
    console.log("1")
    dispatch(addToCartAsync(product));





  }
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {product.map((productItem) => (
        <div
          onClick={() => {
            navigate(`/productdetails/${productItem._id}`);
          }}
          key={productItem._id}
          className="w-64 h-auto rounded overflow-hidden shadow-lg bg-white p-4 flex flex-col mb-12"
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
          <button
  className={`bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-700 w-full text-sm ${productItem.quantity === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
  disabled={productItem.quantity === 0}
  onClick={() => handleAddToCart(productItem)}  // Only assign onClick if the product is in stock
>
  {productItem.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
</button>
          </div>
        </div>
      ))}
    </div>
  );
};




const Productcomp = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const datafetch = async () => {
      try {
        const response = await axios.get('/api/user/getproduct');
        console.log('Fetched data:', response.data.data);
        setProductData(response.data.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    // Fetch data only once when the component mounts
    datafetch();
  }, []); // Empty dependency array ensures useEffect runs only once

  return productData.length > 0 ? (
    <ProductCard product={productData} />
  ) : (
    <div>No products available</div>
  );
};

export default Productcomp;
