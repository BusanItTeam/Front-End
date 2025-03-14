import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white ">
      <div className="text-center p-10 md:p-20 mb-6">
        <h1 className="text-9xl font-extrabold text-gray-800 mb-8">404 Not Found</h1>
        <h2 className="text-3xl text-gray-700 mb-4">페이지를 찾지 못했습니다.</h2>
        <p className="text-xl text-gray-500 mb-6">찾으시는 페이지가 존재하지 않습니다.</p>
        <Link
          to="/"
          className="inline-block bg-red-500 text-white text-lg font-semibold py-3 px-6 rounded-full hover:bg-red-400 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
