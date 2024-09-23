import React from 'react';

const Useroverview = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">My Details</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" value="John" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" value="Doe" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input type="date" value="1990-01-01" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City / District / Town</label>
            <input type="text" value="Springfield" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
              <option>Illinois</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea value="742 Evergreen Terrace" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
          <input type="text" value="62701" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" value="+1 555-123-4567" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" value="johndoe@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Edit</button>
        <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Change Password</button>
      </div>
    </div>
  );
};

export default Useroverview;