import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { FaCoins, FaUser } from "react-icons/fa";
import PointHistory from "./PointHistory";

const MyPoint = () => {
  const { currentUser } = useMyContext();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const navigate = useNavigate();

  console.log("커런트유저 API:", currentUser);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  from-blue-100 to-white p-6">
      {/* 적립금 카드 */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        {/* 헤더 */}
        <div className="flex items-center justify-center gap-2 mb-6 text-gray-800">
          <FaUser className="text-2xl text-blue-500" />
          <h2 className="text-xl font-semibold">
            {currentUser?.username}님의 적립금 현황
          </h2>
        </div>

        {/* 포인트 카드 */}
        <div className="bg-yellow-100 text-yellow-900 p-5 rounded-lg flex items-center justify-between shadow-md border border-yellow-300">
          <FaCoins className="text-3xl text-yellow-600" />
          <div className="text-lg font-semibold">
            적립금:{" "}
            <span className="text-3xl font-bold text-yellow-800">
              {currentUser?.points?.toLocaleString()}P
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            className="flex gap-2 items-center justify-center flex-1 bg-yellow-500 text-white p-3 shadow-lg rounded-md hover:bg-yellow-600 transition-all duration-300 w-full font-semibold"
          >
            {isHistoryVisible ? "사용 내역 닫기" : "사용 내역 보기"}
          </button>
        </div>
      </div>

      {/* 적립금 사용 내역 (토글 애니메이션 적용) */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          isHistoryVisible ? "max-h-[500px] opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0"
        } mt-6 w-full max-w-md`}
      >
        <PointHistory />
      </div>
    </div>
  );
};

export default MyPoint;
