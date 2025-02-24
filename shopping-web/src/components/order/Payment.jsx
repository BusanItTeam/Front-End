import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Payment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const price = searchParams.get("price");

  const handlePayment = (e) => {
    e.preventDefault();
    if (cardNumber && expiryDate && cvv && name && amount) {
      setPaymentSuccess(true);
    } else {
      alert("내용을 입력해주세요");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">결제창</h2>
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block font-medium">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Name on Card</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`${price}원`}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <Link
            to="/ordercomplete"
            className="w-full block p-3 mt-4 bg-red-600 text-white text-center font-bold rounded-md hover:bg-red-700 text-lg"
          >
            결제
          </Link>
          {paymentSuccess && (
            <p className="text-black-600 text-center mt-3 font-medium">
              결제중..
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Payment;
