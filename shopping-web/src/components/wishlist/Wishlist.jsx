import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
        const response = await axios.get("http://localhost:8080/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
          },
        });
        setWishlistItems(response.data);
      } catch (error) {
        console.error("위시리스트를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchWishlist();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allItemIds = wishlistItems.map((item) => item.productId);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <div className="text-center mb-6 pb-7">
        <h1 className="text-3xl font-bold">WISH LIST</h1>
      </div>

      <table className="w-full border-t border-gray-400 text-sm text-center">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="py-2">
              <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === wishlistItems.length} className="cursor-pointer" />
            </th>
            <th className="py-2">이미지</th>
            <th className="py-2">상품정보</th>
            <th className="py-2">옵션</th>
            <th className="py-2">가격</th>
            <th className="py-2 w-25">선택</th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.map((item) => (
            <tr key={item.productId} className="text-center border-b border-gray-400">
              <td className="py-2">
                <input type="checkbox" checked={selectedItems.includes(item.productId)} onChange={() => handleSelectItem(item.productId)} className="cursor-pointer" />
              </td>
              <td className="py-2">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.option}</td>
              <td className="py-2">KRW {item.price.toLocaleString()}</td>
              <td className="flex flex-col space-y-2">
                <button className="bg-gray-500 text-white border border-gray-600 py-0.5 mt-2">주문하기</button>
                <button className="border border-gray-400 py-0.5 ">장바구니 담기</button>
                <button className="border border-gray-400 py-0.5 mb-2">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <div>
          <span>선택상품 </span>
          <button className="border border-gray-400 py-1 px-2 mx-2 ">삭제하기</button>
          <button className="border border-gray-400 py-1 px-2 ">장바구니담기</button>
          <button className="bg-gray-500 text-white border border-gray-600 px-2 mx-2 py-1">주문하기</button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
