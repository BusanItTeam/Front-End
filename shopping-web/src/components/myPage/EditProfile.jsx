import React from 'react';
import { useMyContext } from "../../store/ContextApi";

const EditProfile = () => {
  const { currentUser } = useMyContext();
 
  if (!currentUser) {
    return <div className="text-center mt-10 text-gray-500">로그인이 필요합니다.</div>;
  }

  //address 배열 존재 여부 확인 및 첫 번째 요소 존재 확인
  const address = currentUser.addresses && currentUser.addresses.length > 0 ? currentUser.addresses[0] : null;


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-center mb-4">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
          {currentUser.name?.charAt(0).toUpperCase()}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">{currentUser.name}</h2>
      <p className="text-center text-gray-500 mb-6">{currentUser.email}</p>

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">이름</span>
          <span className="font-medium">{currentUser.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">이메일</span>
          <span className="font-medium">{currentUser.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">전화번호</span>
          <span className="font-medium">{currentUser?.phoneNumber || "등록되지 않음"}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">역할</span>
          <span className={`font-medium ${currentUser?.roles?.includes("ADMIN") ? "text-red-500" : "text-green-500"}`}>
            {currentUser.roles?.includes("ADMIN") ? "관리자" : "일반 사용자"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className='text-gray-600'>우편번호</span>
          <span className='font-medium'>{address?.postcode || "없음"}</span>
        </div>   
        <div className="flex justify-between border-b pb-2">
          <span className='text-gray-600'>도로명 주소</span>
          <span className='font-medium'>{address?.address || "없음"}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className='text-gray-600'>아파트 명</span>
          <span className='font-medium'>{address?.extraAddress || "없음"}</span>
        </div>
        <div className='flex justify-between border-b pb-2'>
          <span className='text-gray-600'>상세 주소</span>
          <span className='font-medium'>{address?.detailAddress || "없음"}</span>
        </div>
     
        
      </div>
    </div>
  );
};

export default EditProfile;
