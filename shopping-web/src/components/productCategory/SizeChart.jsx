import React, { useState } from "react";
import { FaRuler, FaTshirt, FaRulerCombined } from "react-icons/fa";

const SizeChart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-6">
      <div className="w-full max-w-4xl bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">사이즈 안내</h2>
        <p className="text-gray-600 text-center mb-6">
          정확한 사이즈 선택을 위해 아래 정보를 참고해주세요.
        </p>
        
        {/* 사이즈 표 버튼 */}
        <div className="text-center mb-4">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 transition">
            {isOpen ? "사이즈 표 닫기" : "사이즈 표 보기"}
          </button>
        </div>
        
        {/* 사이즈 표 토글 */}
        {isOpen && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">사이즈</th>
                  <th className="border border-gray-300 p-3">가슴 (cm)</th>
                  <th className="border border-gray-300 p-3">허리 (cm)</th>
                  <th className="border border-gray-300 p-3">엉덩이 (cm)</th>
                  <th className="border border-gray-300 p-3">기장 (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">S</td>
                  <td className="border border-gray-300 p-3">86-91</td>
                  <td className="border border-gray-300 p-3">66-71</td>
                  <td className="border border-gray-300 p-3">89-94</td>
                  <td className="border border-gray-300 p-3">60</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-3">M</td>
                  <td className="border border-gray-300 p-3">92-97</td>
                  <td className="border border-gray-300 p-3">72-77</td>
                  <td className="border border-gray-300 p-3">95-100</td>
                  <td className="border border-gray-300 p-3">62</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">L</td>
                  <td className="border border-gray-300 p-3">98-103</td>
                  <td className="border border-gray-300 p-3">78-83</td>
                  <td className="border border-gray-300 p-3">101-106</td>
                  <td className="border border-gray-300 p-3">64</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-3">XL</td>
                  <td className="border border-gray-300 p-3">104-109</td>
                  <td className="border border-gray-300 p-3">84-89</td>
                  <td className="border border-gray-300 p-3">107-112</td>
                  <td className="border border-gray-300 p-3">66</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 치수 재는 방법 버튼 */}
        <div className="text-center mt-6">
          <button 
            onClick={() => setIsGuideOpen(!isGuideOpen)} 
            className="px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-700 transition">
            {isGuideOpen ? "치수 재는 법 닫기" : "치수 재는 법 보기"}
          </button>
        </div>

        {/* 치수 재는 방법 토글 */}
        {isGuideOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-md">
              <FaTshirt size={50} className="text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">가슴 둘레</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                가슴 가장 넓은 부분을 수평으로 측정하세요.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-md">
              <FaRuler size={50} className="text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">허리 둘레</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                허리의 가장 좁은 부분을 자연스럽게 감싸 측정하세요.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-md">
              <FaRulerCombined size={50} className="text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">엉덩이 둘레</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                엉덩이의 가장 넓은 부분을 수평으로 측정하세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChart;