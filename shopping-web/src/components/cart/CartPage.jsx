import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

const CartPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { cartItems, setCartItems } = useMyContext();

  const SHIPPING_COST = 3000;

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const getSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSelectedOrder = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    console.log("Processing order for: ", selectedProducts);
  };

  const handleAllOrder = () => {
    console.log("Processing order for all items: ", cartItems);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        CART
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg py-10">
          <hr className="border-gray-300 mb-4" />
          Cart is empty^^
          <hr className="border-gray-300 mt-4" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg bg-white shadow-md text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4">선택</th>
                  <th className="p-4">이미지</th>
                  <th className="p-4">상품정보</th>
                  <th className="p-4">가격</th>
                  <th className="p-4">수량</th>
                  <th className="p-4">적립금</th>
                  <th className="p-4">삭제</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b text-center text-gray-800"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </td>
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
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-l text-xs"
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-r text-xs"
                      >
                        +
                      </button>
                    </td>
                    <td className="p-4 text-gray-800 font-medium text-sm">
                      {item.points * item.quantity}P
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-800 hover:text-gray-800 text-sm font-bold"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border border-gray-200 rounded-md shadow-md bg-gray-50 text-center text-sm mt-6">
            <h2 className="text-gray-700 font-medium text-lg">
              선택한 상품{" "}
              <span className="font-bold text-gray-900">
                {selectedItems.length}
              </span>
              개
            </h2>
            <h2 className="text-gray-500 font-medium text-lg mt-1">
              {getSelectedTotalPrice().toLocaleString("ko-KR")}원 + 배송비{" "}
              {SHIPPING_COST.toLocaleString("ko-KR")}원
            </h2>
            <h5 className="text-xl font-bold text-gray-800 border-t pt-2 mt-4">
              총 결제 예상금액{" "}
              {(getSelectedTotalPrice() + SHIPPING_COST).toLocaleString(
                "ko-KR"
              )}
              원
            </h5>
            <div className="flex justify-center gap-3 mt-4">
              <Link
                to="/orderpayment"
                onClick={handleSelectedOrder}
                className="border border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-md text-sm bg-white"
              >
                선택상품 주문하기
              </Link>
              <Link
                to="/orderpayment"
                onClick={handleAllOrder}
                className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-md text-sm"
              >
                전체상품 주문하기
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
