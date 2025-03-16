import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import toast from "react-hot-toast";
import { formatCurrency } from "../order/OrderHistory";

const MyReviews = () => {
  const { backendURL, token } = useMyContext();
  const location = useLocation();
  const receivedProduct = location.state?.product || null;
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      try {
        const response = await api.get("/reviews/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orderResponse = await api.get("/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const shippedProducts = orderResponse.data
          .filter((order) => order.status === "SHIPPED")
          .flatMap((order) => order.orderDetails);

        setReviews(response.data);
        setOrderProducts(shippedProducts);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("로그인이 만료되었습니다. 다시 로그인 해주세요.");
        } else {
          toast.error("리뷰 정보를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, [token]);

  if (loading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">내가 작성한 리뷰</h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상품 정보</th>
                <th className="border px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">리뷰</th>
                <th className="border px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">수정</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => {
                const matchingProduct =
                  receivedProduct?.productId === review.productId
                    ? receivedProduct
                    : orderProducts.find((p) => p.productId === review.productId);

                return (
                  <tr key={review.reviewId || `review-${review.productId}-${index}`} className="hover:bg-gray-50">
                    {/* 상품 정보 */}
                    <td className="border px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <img
                          src={`${backendURL}${matchingProduct?.image || review.productImage}`}
                          alt={matchingProduct?.productName || review.productName}
                          className="w-20 h-20 object-cover rounded mb-2"
                        />
                        <div>
                          <h3 className="font-semibold text-center">
                            {matchingProduct?.productName || review.productName}
                          </h3>
                          <p className="text-sm">
                            수량: {matchingProduct?.quantity}개 / 총 가격:{" "}
                            {formatCurrency(matchingProduct?.price * matchingProduct?.quantity)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 리뷰 */}
                    <td className="border px-6 py-4 text-center">
                      <p className="text-sm">별점: {"★".repeat(review.rating + 1)}</p>
                      <p className="mt-2">{review.content}</p>
                    </td>

                    {/* 수정 버튼 */}
                    <td className="border px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          console.log("이동할 URL:", `/edit-review/${review.productId}/${review.optionId}`);
                          navigate(`/edit-review/${review.productId}/${review.optionId}`);
                        }}
                        className="w-full border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300"
                      >
                        리뷰 수정
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
