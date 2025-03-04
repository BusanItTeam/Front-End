import React from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { FaCoins, FaUser } from "react-icons/fa";

const MyPoint = () => {
  const { currentUser } = useMyContext();
  const navigate = useNavigate();

  console.log("커런트유저 API:", currentUser);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        {/* 헤더 */}
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-800">
          <FaUser className="text-xl text-blue-500" />
          <h2 className="text-lg font-semibold">
            {currentUser?.username}님의 적립금 현황
          </h2>
        </div>

        {/* 포인트 카드 */}
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg flex items-center justify-between">
          <FaCoins className="text-2xl text-yellow-600" />
          <div className="text-lg font-semibold">
            적립금:{" "}
            <span className="text-2xl font-bold text-yellow-800">
              {currentUser?.points?.toLocaleString()}P
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/points-history")}
            className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm rounded-md hover:bg-gray-300 transition-all duration-300 w-full"
          >
            포인트 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPoint;
