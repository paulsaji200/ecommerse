import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { deleteAddressAsync } from '../../redux/user/address';

const AddressManagement = () => {
  const dispatch = useDispatch()
  const [addresses, setAddresses] = useState([]); // Initialize state outside of useEffect
  const navigate = useNavigate();


   const deleteAddress = async(addres_id)=>{

    console.log(addres_id)
       dispatch(deleteAddressAsync(addres_id))

   }

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/user/getaddress', { withCredentials: true });
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []); // Empty dependency array means this runs only once

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Manage Addresses</h1>
      <p className="mb-4">Here you can manage the addresses. You can add, edit, or delete the addresses.</p>
      
      <button
        onClick={() => navigate('/userprofile/addaddress')}
        className="w-full bg-pink-400 text-white py-2 rounded mb-4"
      >
        + Add New Address
      </button>
      
      {addresses.length === 0 ? (
        <div className="text-center text-gray-600">No addresses added yet.</div>
      ) : (
        addresses.map((addr, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            {addr.default && <div className="font-bold">Default</div>}
            <div>{addr.name}</div>
            <div>{addr.address}</div>
            <div>{addr.city}, {addr.state}</div>
            <div>{addr.pincode}</div>
            <div>Mobile: {addr.mobile}</div>
            <div className="mt-2">
              <button className="text-blue-600 mr-3">Edit</button>
              <button onClick={()=>{
                deleteAddress(addr._id)
              }} className="text-blue-600">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AddressManagement;
