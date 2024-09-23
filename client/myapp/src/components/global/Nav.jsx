import { useState } from 'react';
import { FaSearch, FaRegUser } from 'react-icons/fa';
import { GrFavorite } from 'react-icons/gr';
import { IoCartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai'; // Import Hamburger Menu icon
import axios from 'axios'; // Import axios for API calls
import api from '../../utils/axios';

const Nav = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

 
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); 

    try {

      const response = await api.get(`/user/products/search?query=${searchQuery}`);
      setSearchResults(response.data); // Set the results
      console.log(response.data); // You can handle the search results here, maybe redirect to a search results page
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <header className="h-16 shadow-md fixed top-0 left-0 w-full bg-gray-100 z-50">
      <div className="h-full container mx-auto flex items-center px-4 sm:px-6 lg:px-20 justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-black cursor-pointer" onClick={() => navigate('/')}>
            Sound Mart
          </div>
        </div>

        {/* Extended Search Bar Centered */}
        <form
          className="hidden sm:flex items-center justify-center w-full max-w-3xl pl-2 border rounded-full border-gray-300 bg-white"
          onSubmit={handleSearchSubmit} // Add submit handler
        >
          <input
            type="text"
            placeholder="Search products here"
            className="w-full outline-none px-4 py-2"
            value={searchQuery} // Track the input value with state
            onChange={handleSearchInputChange} // Update state on input change
          />
          <button type="submit" className="text-lg w-10 bg-black h-8 flex items-center justify-center rounded-r-full text-white">
            <FaSearch />
          </button>
        </form>

        {/* Hamburger Menu for Mobile */}
        <div className="block sm:hidden text-2xl text-black cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <AiOutlineMenu />
        </div>

        {/* Icons and Login Button */}
        <div className="hidden sm:flex items-center gap-10">
          {/* Favorite Icon */}
          <div className="cursor-pointer text-black h-8 w-8 flex items-center justify-center text-xl">
            <GrFavorite />
          </div>

          {/* Cart Icon */}
          <div className="flex items-center justify-center relative">
            <span className="h-8 w-8 flex items-center justify-center cursor-pointer text-black text-xl">
              <IoCartOutline />
            </span>
            <p className="text-black absolute top-0 -right-1 text-sm">0</p>
          </div>

          {/* Login Button */}
          <div className="h-8 flex items-center justify-center relative">
            <p
              onClick={() => navigate("/userprofile")}
              className="text-white h-full px-3 flex items-center justify-center cursor-pointer bg-black text-sm rounded-full"
            >
              <FaRegUser />
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-gray-100 shadow-lg z-40 sm:hidden">
          <div className="flex flex-col items-center py-4">
            <div className="py-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center w-3/4">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full outline-none px-4 py-2 border rounded-full border-gray-300"
                  value={searchQuery} // Track the input value
                  onChange={handleSearchInputChange} // Update state on input change
                />
                <button type="submit" className="ml-2 text-lg">
                  <FaSearch />
                </button>
              </form>
            </div>
            <div className="py-2" onClick={() => navigate('/favorites')}>
              <GrFavorite className="text-2xl text-black" />
              <p className="text-black text-sm">Favorites</p>
            </div>
            <div className="py-2" onClick={() => navigate('/cart')}>
              <IoCartOutline className="text-2xl text-black" />
              <p className="text-black text-sm">Cart</p>
            </div>
            <div className="py-2" onClick={() => navigate('/login')}>
              <FaRegUser className="text-2xl text-black" />
              <p className="text-black text-sm">Login</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
