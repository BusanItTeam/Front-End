import React from "react";
import { Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

const MyPage = () => {
  const { currentUser } = useMyContext();

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">MY PAGE</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="border-gray-300">
          <p className="text-lg font-semibold">{currentUser?.username} 회원님 반감습니다.</p>
          <p className="text-gray-700">저희 쇼핑몰을 이용해 주셔서 감사합니다.</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">나의 주문처리 현황 (최근 3개월 기준)</h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {["입금전", "배송준비중", "배송중", "배송완료"].map((status) => (
            <div key={status} className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">{status}</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 px-8 bg-gray-50 rounded-lg flex justify-between items-center">
          <Link to="/myPage/editProfile">
            <span className="text-lg font-semibold">order </span>
            <span className="text-gray-600"> 주문내역 조회</span>
            <p className="pt-1 text-xs text-gray-400">고객님께서 주문하신 상품의 주문내역을 확인하실 수 있습니다.</p>
          </Link>
          <span className="text-gray-500">&rarr;</span>
        </div>
        <div className="p-4 px-8 bg-gray-50 rounded-lg flex justify-between items-center">
          <Link to="/myPage/editProfile">
            <span className="text-lg font-semibold">profile </span>
            <span className="text-gray-600 ">회원 정보</span>
            <p className="pt-1 text-xs text-gray-400">회원이신 고객님의 개인정보를 관리하는 공간입니다. 개인정보를 최신 정보로 유지하시면 보다 간편히 쇼핑을 즐기실 수 있습니다.</p>
          </Link>
          <span className="text-gray-500">&rarr;</span>
        </div>
        <div className="p-4 px-8 bg-gray-50 rounded-lg flex justify-between items-center">
          <Link to="/myPage/editProfile">
            <span className="text-lg font-semibold">point </span>
            <span className="text-gray-600 ">적립금 내역</span>
            <p className="pt-1 text-xs text-gray-400">적립금은 상품 구매 시 사용하실 수 있습니다. 적립된 금액은 현금으로 환불되지 않습니다.</p>
          </Link>
          <span className="text-gray-500">&rarr;</span>
        </div>
        <div className="p-4 px-8 bg-gray-50 rounded-lg flex justify-between items-center">
          <Link to="/myPage/editProfile">
            <span className="text-lg font-semibold">wishlist </span>
            <span className="text-gray-600 ">관심 상품</span>
            <p className="pt-1 text-xs text-gray-400">관심상품으로 등록하신 상품의 목록을 보여드립니다.</p>
          </Link>
          <span className="text-gray-500">&rarr;</span>
        </div>
        <div className="p-4 px-8 bg-gray-50 rounded-lg flex justify-between items-center">
          <Link to="/myPage/boardList">
            <span className="text-lg font-semibold">board </span>
            <span className="text-gray-600 ">게시글 관리(1:1 문의)</span>
            <p className="pt-1 text-xs text-gray-400">고객님께서 작성하신 게시물을 관리하는 공간입니다. 고객님께서 작성하신 글을 한눈에 관리하실 수 있습니다.</p>
          </Link>
          <span className="text-gray-500">&rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
