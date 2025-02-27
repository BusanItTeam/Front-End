import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";

const CartPage = () => {
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 목록
  const { currentUser, cartItems, setCartItems } = useMyContext(); // 로그인 유저 정보
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const SHIPPING_COST = 3000; // 배송비
  const [imageCache, setImageCache] = useState({});

  const handleImageError = (id) => {
    setImageCache((prev) => ({
      ...prev,
      [id]: "/default-image.jpg",
    }));
  };

  // ✅ JWT 토큰 가져오기
  const token = localStorage.getItem("JWT_TOKEN");

  // ✅ 장바구니 아이템 불러오기
  const fetchCart = async () => {
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data); // 백엔드가 리스트를 반환하므로 바로 설정
    } catch (err) {
      setError("장바구니를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 로그인되지 않은 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCart();
    }
  }, [token, currentUser]);

  // ✅ 장바구니에서 아이템 삭제 (API 요청 포함)
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      await api.delete(`/cart/removeone/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // UI에서 즉시 반영
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cartId !== cartId)
      );
      setSelectedItems((prev) => prev.filter((id) => id !== cartId));
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //수량 변경
  // ✅ 수량 변경 시 가격도 반영되도록 수정
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // 최소 수량 제한

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === id
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.productPrice * newQuantity,
            }
          : item
      )
    );
  };

  // ✅ 체크박스 토글
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // ✅ 선택된 상품 총 가격 계산
  const getSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cartId))
      .reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  // ✅ 선택된 상품 주문
  const handleSelectedOrder = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.cartId)
    );

    if (selectedProducts.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    // 선택된 상품을 state로 전달하며 주문 페이지로 이동
    navigate("/orderpage", { state: { selectedProducts } });
  };

  // ✅ 전체 상품 주문
  const handleAllOrder = () => {
    console.log("Processing order for all items: ", cartItems);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        CART
      </h1>
      {loading ? (
        <p className="text-center text-gray-600">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : cartItems.length === 0 ? (
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
                  <th className="py-2">삭제</th> {/* 삭제 버튼 추가 */}
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.cartId}
                    className="border-b text-center text-gray-800"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.cartId)}
                        onChange={() => toggleSelectItem(item.cartId)}
                      />
                    </td>
                    <td className="p-4">
                      <td className="p-4">
                        <img
                          src={
                            imageCache[item.cartId] ||
                            item.productImageUrl ||
                            "/default-image.jpg"
                          }
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-md shadow-sm"
                          onError={() => handleImageError(item.cartId)}
                        />
                      </td>
                    </td>
                    <td className="p-4 font-medium">{item.productName}</td>
                    <td className="p-4 text-gray-700">
                      {(item.productPrice * item.quantity).toLocaleString(
                        "ko-KR"
                      )}
                      원
                    </td>

                    <td className="p-4 flex items-center justify-center mt-8">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartId, item.quantity - 1)
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
                          updateQuantity(item.cartId, item.quantity + 1)
                        }
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-r text-xs"
                      >
                        +
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-gray-800 hover:text-red-600 text-sm font-bold"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center text-sm mt-6">
            <h2 className="text-gray-700 font-medium text-lg">
              총 금액: {getSelectedTotalPrice().toLocaleString("ko-KR")}원 +
              배송비 {SHIPPING_COST.toLocaleString("ko-KR")}원
            </h2>
            <h5 className="text-xl font-bold text-gray-800 border-t pt-2 mt-4">
              총 결제 금액:{" "}
              {(getSelectedTotalPrice() + SHIPPING_COST).toLocaleString(
                "ko-KR"
              )}
              원
            </h5>
            <div className="flex justify-center gap-3 mt-4">
              <Link
                to="/orderpage"
                onClick={handleSelectedOrder}
                className="border border-gray-400 py-2 px-4 rounded-lg shadow-md text-sm bg-white"
              >
                선택상품 주문
              </Link>
              <Link
                to="/orderpage"
                onClick={handleAllOrder}
                className="bg-gray-900 text-white py-2 px-4 rounded-lg shadow-md text-sm"
              >
                전체상품 주문
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
