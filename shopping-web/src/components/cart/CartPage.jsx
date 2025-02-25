import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import Api from "../../services/Api";

const CartPage = () => {
  // const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 상태
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 상태
  const { token, currentUser, cartItems, setCartItems, products, setProducts } =
    useMyContext(); // 현재 로그인한 유저 정보 가져오기
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const SHIPPING_COST = 3000; //배송비
  const userId = currentUser?.id; // Ensure userId is correctly retrieved
  // const productId = (productName) => {
  //   const product = products.find((p) => p.name === productName);
  //   return product ? product.id : null;
  // };

  // // 🔹 장바구니 데이터 가져오기 함수
  // const fetchCart = async () => {
  //   if (!userId) return; // 로그인된 유저가 없으면 실행 안 함
  //   try {
  //     setLoading(true);
  //     setError(null); // 기존 에러 초기화
  //     const response = await Api.get(`/carts/${userId}`);
  //     setCartItems(response.data);
  //   } catch (err) {
  //     setError("Failed to load cart");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // 🔹 1. 로그인되지 않은 경우 로그인 페이지로 이동
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   } else {
  //     fetchCart();
  //   }
  // }, [token, navigate]); // token 변경 시 실행

  // // 🔹 2. 로그인한 유저가 변경될 때 장바구니 데이터 다시 불러오기
  // useEffect(() => {
  //   if (userId) {
  //     fetchCart();
  //   }
  // }, [userId]); // userId 변경 시 실행

  // 1. 로그인 여부 확인 -> 로그인 안 했으면 로그인 페이지로 이동
  useEffect(() => {
    console.log(token);
    if (!token) {
      navigate("/login");
    } else {
      fetchCart();
    }
  }, [currentUser]);

  // 🚀 2. 로그인한 유저의 장바구니 데이터 불러오기
  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // JWT 토큰으로 인증
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error("장바구니 데이터를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("장바구니 불러오기 오류:", error);
    }
  };

  // 🚀 3. 장바구니 아이템 삭제
  const removeItem = async (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setSelectedItems((prevSelected) =>
      prevSelected.filter((itemId) => itemId !== id)
    );
  };
  // 🚀 4. 장바구니 수량 변경
  const updateQuantity = async (id, quantity) => {
    const newQuantity = Math.max(1, quantity);

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  //체크박스 토글
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  //선택된 아이템만 총합 구현
  const getSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  //선택된 아이템만 주문
  const handleSelectedOrder = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    setCartItems(selectedProducts);
    console.log("Processing order for: ", selectedProducts);
  };

  //전체상품 주문
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
          <hr className="border-b " />
          장바구니가 비어있습니다.
          <hr className="border-b" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-t text-sm text-center">
              <thead>
                <tr className="border-b">
                  <th className="py-2">선택</th>
                  <th className="py-2">이미지</th>
                  <th className="py-2">상품정보</th>
                  <th className="py-2">가격</th>
                  <th className="py-2">수량</th>
                  <th className="py-2">적립금</th>
                  <th className="py-2">삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr></tr>
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
          <br />
          <br />
          <div className="  text-center text-sm mt-6">
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
                to="/orderpage"
                onClick={handleSelectedOrder}
                className="border border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-md text-sm bg-white"
              >
                선택상품 주문하기
              </Link>
              <Link
                to="/orderpage"
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
