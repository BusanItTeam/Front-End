import React from "react";
import { Link } from "react-router-dom";

const MyPage = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="relative bg-white w-full max-w-screen-xl h-[1533px] mt-5">
        <p className="relative opacity-50 font-normal text-gray-600 text-sm tracking-wide leading-6 whitespace-nowrap">
          <span className="text-black">Welcome! </span>
          <span className="text-red-600">Md Rimel</span>
        </p>

        <div className="absolute top-[221px] left-[1166px] text-transparent font-normal text-sm leading-6 tracking-wide whitespace-nowrap">
          <span className="font-semibold">Md Rimel</span>
        </div>

        <div className="absolute top-[322px] left-[135px] font-medium text-gray-600 text-lg">
          <Link to="/editProfile">회원 정보 수정</Link>
          <div>주문내역 조회</div>
          <div>적립금 내역</div>
          <div>나의 위시리스트</div>
          <div>1:1 문의</div>
        </div>

        <div className="absolute top-[323px] left-[435px] bg-primary shadow-lg rounded-lg w-[870px] h-[630px]">
          <div className="absolute top-[39px] left-[80px] text-secondary font-semibold text-xl leading-8">Edit Your Profile</div>

          <div className="absolute top-[84px] left-[80px] flex gap-12">
            <div className="flex flex-col gap-2">
              <div className="font-medium text-gray-600 text-lg">First Name</div>
              <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
                <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">Md</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-medium text-gray-600 text-lg">Last Name</div>
              <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
                <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">Rimel</div>
              </div>
            </div>
          </div>

          <div className="absolute top-[190px] left-[80px] flex gap-12">
            <div className="flex flex-col gap-2">
              <div className="font-medium text-gray-600 text-lg">Email</div>
              <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
                <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">rimel1111@gmail.com</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-medium text-gray-600 text-lg">Address</div>
              <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
                <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">Kingston, 5236, United State</div>
              </div>
            </div>
          </div>

          <div className="absolute top-[296px] left-[80px] flex flex-col gap-4">
            <div className="font-medium text-gray-600 text-lg">Password Changes</div>

            <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
              <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">Current Password</div>
            </div>
            <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
              <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">New Password</div>
            </div>
            <div className="relative w-[330px] h-[50px] bg-secondary rounded-lg">
              <div className="absolute top-[12px] left-[16px] text-gray-600 opacity-50">Confirm New Password</div>
            </div>
          </div>

          <div className="absolute top-[534px] left-[487px] flex items-center gap-8">
            <div className="text-gray-600 text-lg">Cancel</div>
            <button className="flex items-center justify-center gap-2 p-4 px-12 bg-blue-600 text-white rounded-lg">
              <div className="font-medium text-sm">Save Changes</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
