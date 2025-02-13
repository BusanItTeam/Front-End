import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const sampleItems = [
      {
        id: 1,
        name: "Product 1",
        price: 25000,
        image: "/woman-2799490_1280.jpg",
        quantity: 1,
        points: 2,
      },
      {
        id: 2,
        name: "Product 2",
        price: 19000,
        image: "/khaki-2723896_1280.jpg",
        quantity: 1,
        points: 1,
      },
      {
        id: 3,
        name: "Product 3",
        price: 15000,
        image: "/shirts-1184914_1280.jpg",
        quantity: 1,
        points: 1,
      },
    ];
    setCartItems(sampleItems);
  }, []);

  const SHIPPING_COST = 3000;

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600"></h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="p-3">이미지</th>
              <th className="p-3">상품정보</th>
              <th className="p-3">가격</th>
              <th className="p-3">수량</th>
              <th className="p-3">적립금</th>
              <th className="p-3">배송비</th>
              <th className="p-3">총금액</th>
              <th className="p-3">삭제</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-b text-center">
                <td className="p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md shadow-md"
                  />
                </td>
                <td className="p-3 font-semibold">{item.name}</td>
                <td className="p-3 text-lg text-gray-700">
                  {item.price.toLocaleString("ko-KR")}원
                </td>
                <td className="p-3 flex justify-center items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded-l"
                  >
                    -
                  </button>
                  <span className="mx-3 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded-r"
                  >
                    +
                  </button>
                </td>
                <td className="p-3 text-red-600 font-bold">
                  {item.points * item.quantity}P
                </td>
                <td className="p-3 text-gray-600">
                  {SHIPPING_COST.toLocaleString("ko-KR")}원
                </td>
                <td className="p-3 font-semibold">
                  {(item.price * item.quantity).toLocaleString("ko-KR")}원
                </td>
                <td className="p-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-lg font-bold"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md bg-gray-100 text-right w-fit ml-auto">
        <h2 className="text-xl font-bold">
          Subtotal: {getTotalPrice().toLocaleString("ko-KR")}원
        </h2>
        <h2 className="text-xl font-bold">
          Shipping: {SHIPPING_COST.toLocaleString("ko-KR")}원
        </h2>
        <h2 className="text-2xl font-bold text-red-600 border-t pt-2 mt-2">
          Total: {(getTotalPrice() + SHIPPING_COST).toLocaleString("ko-KR")}원
        </h2>
        <br />
        <Link
          to="/orderPayment"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          결재하기 💳
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
