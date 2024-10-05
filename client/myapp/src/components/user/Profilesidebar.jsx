
import { Link } from "react-router-dom";

const Profilesidebar = () => {
  return (
    <div className=" p-6 bg-gray-800 text-gray-200 shadow-lg min-h-screen">
      <div className="text-center mb-6">
        <img 
          src="https://via.placeholder.com/100" 
          alt="User Avatar" 
          className="rounded-full mx-auto mb-2"
        />
        <h2 className="text-xl font-semibold text-green-400">Hello User</h2>
      </div>

      <nav>
        <ul className="space-y-4">
          <li>
            <Link 
              to="/userprofile/overview" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              Account Overview
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/orders" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              My Orders
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/address" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              Manage Addresses
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/wishlist" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              My Wishlist
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/wallet" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              Wallet
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Profilesidebar;
