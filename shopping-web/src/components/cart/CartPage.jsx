import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import Wishlist from "../wishlist/Wishlist";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 상태
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 상태
  const { token, backendURL } = useMyContext(); // 토큰 가져오기
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const SHIPPING_COST = 3000; // 배송비
  const { userId } = useParams();

  
  // 체크박스 선택/해제 기능
  const toggleSelectItem = (cartId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(cartId)) {
        return prevSelected.filter((id) => id !== cartId);
      } else {
        return [...prevSelected, cartId];
      }
    });
  };

  // 장바구니 데이터 불러오기
  const updateCart = async () => {
    try {
      const response = await api.get("/cart/show", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("🚨 장바구니 데이터 불러오기 실패:", error)
    }
  };

  //  수량 변경 기능
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return; // 최소 수량 1 유지

    try {
        const response = await api.put(
            `/cart/update/${cartId}`, 
            { quantity: newQuantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartId === cartId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    } catch (error) {
        console.error("🚨 수량 변경 실패:", error);
        alert("❌ 수량 변경에 실패했습니다. 다시 시도해주세요.");
    }
};

  const getAllSelectedItems = () => {
    return cartItems.map((item) => item.cartId);
    
  }
  

  // 토탈 가격 계산
  const getSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cartId))
      .reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };


  const handleSelectedOrder = () => {
    if (selectedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    navigate("/orderpage", { state: { selectedItems } });
  };

  
  useEffect(() => {
    const fetchCart = async () => {
      try {
       
        if (!token) throw new Error("🚨 인증 토큰이 없습니다.");
  
    
        const response = await api.get("/cart/show", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("장바구니 데이터:", response.data);
        setCartItems(response.data);
      } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (token) fetchCart();
  }, [token]);
  
  useEffect(() => {
    updateCart(); // 최초 장바구니 데이터 불러오기
  }, [token]);

  const deleteCartItem = async (cartId) => {
    try {
      const response = await api.delete(`/cart/delete/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
        alert("🛒 장바구니에서 삭제되었습니다.");
      }
    } catch (error) {
      console.error("🚨 장바구니 아이템 삭제 실패:", error);
      alert("❌ 장바구니 아이템 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  

  const handleAllOrder = () => {
    navigate("/orderpage", { state: { selectedItems: cartItems.map((item) => item.id) } });
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        CART
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg py-10">
          <hr className="border-b" />
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
                  <th className="py-2">카테고리</th>
                  <th className="py-2">상품정보</th>
                  <th className="py-2">가격</th>
                  <th className="py-2">사이즈</th>
                  <th className="py-2">색상</th>
                  <th className="py-2">수량</th>
                  <th className="py-2">적립금</th>
                  <th className="py-2">삭제</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.id ?? item.productId}
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
                      <img //상품 이미지 출력
                        src={`${backendURL}${item.productImageUrl}`}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                      />
                    </td>
                    {/* 카테고리 */}
                    <td className="p-4 text-gray-700">
                      {(item.categoryName)}
                    </td>
                    {/* 상품이름 */}
                    <td className="p-4 font-medium">{item.productName}</td>
                    {/* 상품 가격 */}
                    <td className="p-4 text-gray-700"> 
                      {(item.productPrice?? 0).toLocaleString("ko-KR")}원
                    </td>
                    {/* 상품 사이즈 */}
                    <td className="p-4 text-gray-700">
                      {(item.size)}
                    </td>
                    {/* 상품색상 */}
                    <td className="p-4 text-gray-700">
                      {(item.color)}
                    </td>
                    <td className="p-4 flex justify-center items-center mt-4">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-l text-xs"
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-r text-xs"
                      >
                        +
                      </button>
                    </td>
                    <td className="p-4 text-gray-800 font-medium text-sm">
                      {item.productPrice / 10 * (item.quantity)}
                    </td>
                    
                    <td className="p-4">
                      <button
                        onClick={() => deleteCartItem(item.cartId)}
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
          <div className="text-center text-sm mt-6">
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
