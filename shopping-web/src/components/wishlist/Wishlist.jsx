import React from "react";
import { useState } from "react";

const Wishlist = () => {
  const items = [
    {
      id: 1,
      image: "/public/shirts-1184914_1280.jpg",
      name: "2way chouchou",
      price: 12000,
      points: 100,
      shippingType: "기본배송",
      shippingCost: 2900,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100",
      name: "wind jumper",
      price: 88000,
      points: 800,
      shippingType: "기본배송",
      shippingCost: 2900,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/100",
      name: "padded shirt",
      price: 76000,
      points: 700,
      shippingType: "기본배송",
      shippingCost: 2900,
    },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allItemIds = items.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <div className="text-center mb-6 pb-7">
        <h1 className="text-3xl font-bold">WISH LIST</h1>
      </div>

      <table className="w-full border-t  border-gray-400 text-sm text-center">
        <thead>
          <tr className="border-b  border-gray-400">
            <th className="py-2">
              <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length} className="cursor-pointer" />
            </th>
            <th className="py-2">이미지</th>
            <th className="py-2">상품정보</th>
            <th className="py-2">판매가</th>
            <th className="py-2">배송구분</th>
            <th className="py-2">배송비</th>
            <th className="py-2">합계</th>
            <th className="py-2 w-25">선택</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-center border-b  border-gray-400">
              <td className="py-2">
                <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="cursor-pointer" />
              </td>
              <td className="py-2">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="py-2">{item.name}</td>
              <td className="py-2">KRW {item.price.toLocaleString()}</td>
              <td className="py-2">{item.shippingType}</td>
              <td className="py-2">KRW {item.shippingCost.toLocaleString()} 조건</td>
              <td className="py-2 font-semibold">KRW {(item.price + item.shippingCost).toLocaleString()}</td>
              <td className="flex flex-col space-y-2">
                <button className="bg-gray-500 text-white border border-gray-600 py-0.5 mt-2">주문하기</button>
                <button className="border border-gray-400 py-0.5 ">장바구니 담기</button>
                <button className="border border-gray-400 py-0.5 mb-2">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <div>
          <span>선택상품 </span>
          <button className="border border-gray-400 py-1 px-2 mx-2 ">삭제하기</button>
          <button className="border border-gray-400 py-1 px-2 ">장바구니담기</button>
        </div>
        <div>
          <button className="bg-gray-500 text-white border border-gray-600 px-2 mx-2 py-1">전체상품주문</button>
          <button className="bg-gray-500 text-white border border-gray-600 px-2 py-1">관심상품비우기</button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
