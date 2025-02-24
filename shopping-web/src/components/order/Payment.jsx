import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Payment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const price = searchParams.get("price") || "0";
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentSuccess) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/orderpage/ordercomplete");
      }, 2000);
    }
  }, [paymentSuccess, navigate]);

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "") // Remove non-digit characters
      .replace(/(.{4})/g, "$1 ") // Add space every 4 digits
      .trim();
  };

  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "") // Remove non-digit characters
      .replace(/^(\d{2})(\d{0,2})/, "$1/$2") // Insert / after two digits
      .slice(0, 5); // Max length of 5 (MM/YY)
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (cardNumber && expiryDate && cvv && name) {
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
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) =>
                  setExpiryDate(formatExpiryDate(e.target.value))
                }
                placeholder="MM/YY"
                maxLength={5}
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
                maxLength={3}
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
              onChange={(e) => setAmount(e.target.value)}
              value={`${parseInt(price).toLocaleString()}원`}
              className="w-full p-2 border rounded-md"
              readOnly
            />
          </div>
          <button
            type="submit"
            className="w-full block p-3 mt-4 bg-gray-900 text-white text-center font-bold rounded-md hover:bg-gray-800 text-lg"
            disabled={loading}
          >
            {loading ? "결제 진행 중..." : "결제"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
