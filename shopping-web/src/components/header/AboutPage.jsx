import React from "react";
import { FaBullseye, FaEye, FaCheckCircle } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-6">
      <div className="w-full max-w-5xl bg-white p-10 shadow-2xl rounded-lg relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-10"></div>
        
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-10 relative z-10">회사 소개</h2>
        <p className="text-gray-600 text-lg text-center mb-10 leading-relaxed relative z-10">
          최고의 제품과 서비스를 제공하는 것을 목표로 합니다. 
          고객님께 최상의 쇼핑 경험을 선사하겠습니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="flex flex-col items-center text-center bg-gray-100 p-8 rounded-lg shadow-lg transition hover:scale-105 gap-y-4">
            <div className="w-24 h-24 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg">
              <FaBullseye size={50} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700">우리의 목표</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              혁신적이고 고품질의 제품을 제공하여 고객님의 일상을 더욱 편리하게 만듭니다.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center bg-gray-100 p-8 rounded-lg shadow-lg transition hover:scale-105 gap-y-4">
            <div className="w-24 h-24 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg">
              <FaEye size={50} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700">우리의 비전</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              신뢰받는 브랜드로 자리 잡아 고객님께 혁신과 편리함을 제공하는 것이 우리의 목표입니다.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center relative z-10">
          <h3 className="text-3xl font-semibold text-gray-700 mb-6">우리를 선택해야 하는 이유</h3>
          <ul className="mt-4 text-gray-600 space-y-4 text-lg">
            <li className="flex items-center justify-center text-xl font-medium"><FaCheckCircle className="text-blue-500 text-2xl mr-3" /> 고품질 제품</li>
            <li className="flex items-center justify-center text-xl font-medium"><FaCheckCircle className="text-blue-500 text-2xl mr-3" /> 고객 만족 보장</li>
            <li className="flex items-center justify-center text-xl font-medium"><FaCheckCircle className="text-blue-500 text-2xl mr-3" /> 빠르고 안전한 배송</li>
            <li className="flex items-center justify-center text-xl font-medium"><FaCheckCircle className="text-blue-500 text-2xl mr-3" /> 24/7 고객 지원</li>
          </ul>
        </div>

        <div className="mt-12 flex justify-center relative z-10">
          <button className="px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 transition">쇼핑하러 가기</button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;