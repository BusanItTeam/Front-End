import React, { useEffect } from 'react'
import { useMyContext } from '../../store/ContextApi'
import { useNavigate } from 'react-router-dom';

const PointHistory = () => {
    const {currentUser} = useMyContext();


    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">💰 적립금 사용 내역</h2>
  
        {currentUser?.pointHistories?.length > 0 ? (
          <ul className="space-y-4">
            {currentUser.pointHistories.map((history, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {history.amount.toLocaleString()}원
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(history.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <span className="text-sm text-green-600 font-bold">사용 완료 ✅</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">사용 내역이 없습니다.</p>
        )}
      </div>
     
    );
  };
  

export default PointHistory