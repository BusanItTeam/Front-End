import React, { useState } from "react";

const PaymentCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handlePayment = () => {
    alert("Payment Processed Successfully!");
  };

  return (
    <form className="w-96 p-6 shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4 text-center">
        <label>Payment Details</label>
      </h2>

      <div className="mb-4">
        Cardholder Name
        {/* <Input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
      </div>

      <div className="mb-4">
        <label>Card Number</label>
        {/* <Input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          maxLength={19}
        /> */}
      </div>

      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label>Expiry Date</label>
          {/* <Input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            maxLength={5}
          /> */}
        </div>

        <div className="w-1/2">
          <label>CVV</label>
          {/* <Input
            type="password"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength={3}
          /> */}
        </div>
      </div>

      <button className="w-full mt-4" onClick={handlePayment}>
        Pay Now
      </button>
    </form>
  );
};

export default PaymentCard;
