import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../../store/ContextApi";
import { format, isValid, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import { toast } from "react-hot-toast";
const EditProfile = () => {
  const { currentUser } = useMyContext();
  const navigate = useNavigate();
  //useState로 관리
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [extraAddress, setExtraAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  
  console.log("데이타", currentUser);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      if (currentUser.addresses?.length > 0) {
        const addr = currentUser.addresses[0];
        setPostcode(addr.postcode || "");
        setAddress(addr.address || "");
        setExtraAddress(addr.extraAddress || "");
        setDetailAddress(addr.detailAddress || "");
      }
    }
  }, [currentUser]);

  //페이지 이동 함수
  const handleGoToMyPage = () => {
    navigate("/myPage");
  };

  //날짜 변환
  const formatDate = (isoString) => {
    if (!isoString) return "입력되지 않음";
    const date = parseISO(isoString);
    return isValid(date)
      ? format(date, "yyyy-MM-dd HH시 mm분")
      : "입력되지 않음";
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      console.log("JWT Token 확인:", token);

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await api.put(
        "/auths/user",
        {
          name: name || null,
          phoneNumber: phoneNumber || null,
          address: {
            postcode: postcode || null,
            address: address || null,
            extraAddress: extraAddress || null,
            detailAddress: detailAddress || null,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true, //
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error("업데이트 실패:", error);
      alert("업데이트에 실패했습니다.");
    }
  };

  //유저가 아닐시 로그인 필요
  if (!currentUser) {
    return (
      <div className="text-center mt-10 text-gray-500">
        로그인이 필요합니다.
      </div>
    );
  }
  console.log("확인", currentUser);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 mb-6">
      <h2 className="text-xl font-semibold text-red-500 mb-4">
        {" "}
        {name} 님의 프로필 정보
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            아이디
          </label>
          <input
            type="name"
            placeholder="홍길동"
            defaultValue={currentUser?.username}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            성함
          </label>
          <input
            type="name"
            placeholder="홍길동"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            placeholder="rimel111@gmail.com"
            defaultValue={currentUser?.email}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            전화번호
          </label>
          <input
            type="phoneNumber"
            placeholder="010-0000-0000"
            defaultValue={currentUser?.phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            우편번호
          </label>
          <input
            type="text"
            placeholder="00000"
            defaultValue={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            주소
          </label>
          <input
            type="text"
            placeholder="양주로152"
            defaultValue={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            아파트명 및 명칭
          </label>
          <input
            type="text"
            placeholder="대동아파트"
            defaultValue={extraAddress}
            onChange={(e) => setExtraAddress(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            상세주소
          </label>
          <input
            type="text"
            placeholder="001동 1112호"
            defaultValue={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            계정 생성일
          </label>
          <input
            type="text"
            placeholder="2024-02-01"
            defaultValue={
              currentUser?.createdDate
                ? formatDate(currentUser.createdDate)
                : ""
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="col-span-2 flex justify-between mt-4">
          <button
            className="text-gray-500 hover:underline"
            onClick={handleGoToMyPage}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
