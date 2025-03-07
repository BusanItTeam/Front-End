import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/Formatting";

const Wishlist = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backendURL = "http://localhost:8080";

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("JWT_TOKEN");

        if (!token) {
          console.warn("JWT 토큰이 없습니다. 로그인 페이지로 이동합니다.");
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // 위시리스트 데이터 불러오기
        const wishlistResponse = await axios.get(`${backendURL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ 위시리스트 데이터:", wishlistResponse.data);

        setWishlist(wishlistResponse.data || []); // 데이터가 없으면 빈 배열 설정
      } catch (error) {
        console.error("🚨 위시리스트 불러오기 오류:", error);
        setError("위시리스트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, backendURL]);

  // { 전체상품 선택 }
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allItemIds = wishlist.map((item) => item.productId);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  // { 한개상품 선택 }
  const handleSelectItem = (wishListId) => {
    if (selectedItems.includes(wishListId)) {
      setSelectedItems(selectedItems.filter((id) => id !== wishListId));
    } else {
      setSelectedItems([...selectedItems, wishListId]);
    }
  };

  // { 개별 상품 삭제}
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (!token) return;

      await axios.delete(`${backendURL}/api/wishlist/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // UI에서 즉시 제거
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("🚨 위시리스트 삭제 오류:", error);
    }
  };

  // { 선택 상품 삭제 }
  const removeSelectedItems = async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (!token) return;

      // 선택된 상품들의 ID를 가져오기
      const selectedProductIds = selectedItems;

      // 여러 상품을 삭제하는 API 호출
      await Promise.all(
        selectedProductIds.map((productId) =>
          axios.delete(`${backendURL}/api/wishlist/product/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      // UI에서 선택된 상품들 제거
      setWishlist((prev) =>
        prev.filter((item) => !selectedItems.includes(item.productId))
      );
      setSelectedItems([]); // 삭제 후 선택 상태 초기화
      toast.success("선택된 상품이 삭제되었습니다."); // 삭제 성공 메시지
    } catch (error) {
      console.error("🚨 선택된 상품 삭제 오류:", error);
      toast.error("선택된 상품을 삭제하는 중 오류가 발생했습니다."); // 삭제 실패 메시지
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <div className="text-center mb-6 pb-7">
        <h1 className="text-3xl font-bold">WISH LIST</h1>
      </div>

      <table className="w-full border-t border-gray-400 text-sm text-center">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="py-2">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedItems.length === wishlist.length}
                className="cursor-pointer"
              />
            </th>
            <th className="py-2">이미지</th>
            <th className="py-2">상품정보</th>
            <th className="py-2">옵션</th>
            <th className="py-2">가격</th>
            <th className="py-2 w-25">선택</th>
          </tr>
        </thead>
        <tbody>
          {wishlist.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center">
                위시리스트가 비어 있습니다.
              </td>
            </tr>
          ) : (
            wishlist.map((item) => (
              <tr
                key={item.productId}
                className="text-center border-b border-gray-400"
              >
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId)}
                    onChange={() => handleSelectItem(item.productId)}
                    className="cursor-pointer"
                  />
                </td>
                {/* 이미지 클릭 시 상세 페이지 이동 */}
                <td className="py-2">
                  <Link to={`/product/${item.productId}`}>
                    <img
                      src={`${backendURL}${item.productImage}`}
                      alt={item.productName}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  </Link>
                </td>
                {/* 상품 클릭 시 상세 페이지 이동 */}
                <td className="py-2">
                  <Link
                    to={`/product/${item.productId}`}
                    className="hover:underline"
                  >
                    {item.productName}
                  </Link>
                </td>
                <td className="py-2">{item.option || "옵션 없음"}</td>
                <td className="py-2">
                  {/* 가격 정보 */}
                  {item.discountRate && item.discountRate > 0 ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">
                        {formatCurrency(item.price)}
                      </span>
                      {formatCurrency(
                        item.price - (item.price * item.discountRate) / 100
                      )}
                    </>
                  ) : (
                    formatCurrency(item.price)
                  )}
                </td>
                <td className="flex flex-col space-y-2">
                  {/* 장바구니 담기 버튼 */}
                  <button className="bg-gray-500 text-white border border-gray-600 py-0.5 mt-2">
                    장바구니담기
                  </button>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="border border-gray-400 py-0.5 mb-2"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 선택 삭제 버튼 */}
      <div className="flex justify-end mt-4">
        <div>
          <span>선택상품 </span>
          <button
            onClick={removeSelectedItems}
            className="border border-gray-400 py-1 px-2 mx-2"
          >
            삭제하기
          </button>
          <button className="bg-gray-500 text-white border border-gray-600 px-2 mx-2 py-1">
            장바구니담기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
