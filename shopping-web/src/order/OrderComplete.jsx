import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderComplete = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const storedOrderId = localStorage.getItem("orderId");
    setOrderId(storedOrderId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/orderdetails");
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/productcategory");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
      <h2 className="text-xl font-semibold">주문완료</h2>
      <p className="mt-4 text-lg">주문이 완료되었습니다.</p>

      <p className="mt-2 text-red-500 text-sm">
        주문아이디 : <span className="font-medium">{orderId}</span>
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 border border-gray-400 rounded-lg"
        >
          주문상세보기
        </button>

        <button
          onClick={handleClick}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
        >
          계속 쇼핑하기
        </button>
      </div>
    </div>
  );
};

export default OrderComplete;
