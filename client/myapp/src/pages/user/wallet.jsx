import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

const WalletPage = () => {
  const [amount, setAmount] = useState('1000');
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center">
          <Wallet className="mr-2" />
          <span className="text-lg font-semibold">My Wallet</span>
        </div>
        <div className="text-blue-600 font-semibold">
          Wallet Balance : ₹ 1000
        </div>
      </div>
      
      <button className="w-full bg-red-600 text-white py-2 rounded-md mb-4">
        VIEW TRANSACTION HISTORY
      </button>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span>Add To Wallet</span>
          <span>Credited</span>
          <span className="text-green-600">+2000</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Pay To Picmart</span>
          <span>Debited</span>
          <span className="text-red-600">-40000</span>
        </div>
      </div>

      <div className="text-right mb-4">
        <a href="#" className="text-blue-600">View More.....</a>
      </div>

      <div className="bg-pink-300 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">ADD MONEY TO WALLET</h2>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded"
        />
        <button className="bg-purple-800 text-white px-4 py-2 rounded float-right mb-4">
          PAY
        </button>
        <div className="clear-both"></div>
        <p className="font-semibold mb-2">Payment Method</p>
        <p className="text-sm mb-2">Select any payment method</p>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="debitCredit"
              checked={paymentMethod === 'debitCredit'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Debit Card / Credit card
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            UPI Method
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="internetBanking"
              checked={paymentMethod === 'internetBanking'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Internet Banking
          </label>
        </div>
        <p className="text-xs mt-2">*Internet Charges may apply</p>
      </div>
    </div>
  );
};

export default WalletPage;