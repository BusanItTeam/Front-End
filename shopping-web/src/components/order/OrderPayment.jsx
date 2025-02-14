
import { useState } from "react";
import { useMyContext } from "../../store/ContextApi";

const OrderPaymentPage = () => {
  const { cartItems } = useMyContext();
  const SHIPPING_COST = 3000;
  const DISCOUNT = 7100;

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        ORDER
      </h1>
      <div className=" bg-white  p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-3">주문상품</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg bg-white shadow-md text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-4"></th>
                <th className="p-4">상품정보</th>
                <th className="p-4">가격</th>
                <th className="p-4">수량</th>
                <th className="p-4">예상 적립금</th>
                <th className="p-4">배송구분</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b text-center text-gray-800"
                >
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-700">
                    {item.price.toLocaleString("ko-KR")}원
                  </td>
                  <td className="p-4 flex justify-center items-center mt-4">
                    <span className="mx-2 text-sm text-gray-900">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800 font-medium text-sm">
                    {item.points * item.quantity}P
                  </td>
                  <td className="p-4">기본배송</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow-md p-4 mt-6">
        <h2 className="text-lg font-medium text-gray-800 mb-3">결제정보</h2>
        <div className="text-gray-700 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span>총 상품금액</span>
            <span>{getTotalPrice().toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>배송료</span>
            <span>+ {SHIPPING_COST.toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-2 border-b text-red-600">
            <span>총 할인금액</span>
            <span>- {DISCOUNT.toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg text-gray-900">
            <span>총 결제금액</span>
            <span>
              {(getTotalPrice() + SHIPPING_COST - DISCOUNT).toLocaleString(
                "ko-KR"
              )}
              원
            </span>
          </div>
        </div>
      </div>

      <button className="w-full bg-gray-900 text-white py-3 mt-6 rounded-lg font-medium hover:bg-gray-800">
        결제하기
      </button>

    </div>
  );
};

export default OrderPaymentPage;
