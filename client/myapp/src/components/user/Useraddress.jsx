import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { deleteAddressAsync } from '../../redux/user/address';
import AddressForm from './Addadress';
import { useSelector } from 'react-redux';
import { selectAddresses } from '../../redux/user/address';
import { fetchAddressesAsync } from '../../redux/user/address';
const AddressManagement = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const addresses =  useSelector((state) => state.address.addresses);
  const [current, setCurrent] = useState(null);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  const deleteAddress = async (address_id) => {
    try {
     dispatch(deleteAddressAsync(address_id));
    
     
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };
  console.log(addresses)

  const handleEditClick = (address) => {
    setShowForm(true);
    setCurrent(address);
    setEdit(true);
  };

  const handleCloseForm = () => {
    setEdit(false);
    setCurrent(null);
    setShowForm(false); 
  };

  

  useEffect(() => {
      dispatch(fetchAddressesAsync())
  }, [dispatch]);

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
              <button onClick={() => handleEditClick(addr)} className="text-blue-600 mr-3">Edit</button>
              <button onClick={() => deleteAddress(addr._id)} className="text-blue-600">Delete</button>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <AddressForm addressData={current} isEdit={edit} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default AddressManagement;
