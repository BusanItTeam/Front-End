import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const { token, backendURL } = useMyContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 상태 매핑 객체
  const statusMap = {
    PENDING: "입금대기중",
    PAID: "결제완료",
    READY_FOR_SHIPPING: "배송준비중",
    SHIPPING: "배송중",
    SHIPPED: "배송완료",
  };
 

  

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get("/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API 응답 데이터:", response.data); // 데이터 구조 확인용
        setOrders(response.data);
      } catch (error) {
        console.error("주문 내역 조회 오류:", error);
        toast.error("주문 내역을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">주문 내역</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">주문 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">주문번호</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상품정보</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">총 결제 금액</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">배송상태</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">리뷰</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  {/* 주문번호 */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">#{order.orderId}</td>

                  {/* 상품정보 */}
                  <td className="px-6 py-4 text-center">
                    {order.orderDetails?.map((detail, index) => (
                      <div
                        key={`${detail.productId}-${detail.optionId}`}
                        className="flex items-center justify-center mb-4 last:mb-0"
                      >
                        <img
                          src={`${backendURL}${detail.Image}`}
                          alt={detail.ProductName}
                          className="w-20 h-20 object-cover rounded-lg mr-4"
                        />
                        <div className="text-center">
                          <p className="font-semibold">{detail.ProductName}</p>
                          <p className="text-sm text-gray-500">
                            {detail.OptionColor} / {detail.OptionSize}
                          </p>
                          <p className="text-sm">수량: {detail.quantity}개</p>
                        </div>
                      </div>
                    ))}
                  </td>


                  {/* 가격 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.orderDetails?.map((detail, index) => (
                      <div key={`${detail.productId}-${detail.optionId}-price`} className="mb-2 text-center">
                        {/* totalPrice 계산 후 출력 */}
                        {formatCurrency(order.totalPrice)}
                      </div>
                    ))}
                  </td>
                  {/* 배송상태 */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      {statusMap[order.status] || order.status}
                    </span>
                  </td>


                    {/* 리뷰 버튼 */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                    {order.status === "SHIPPED" && order.orderDetails.length > 0 ? (
                      order.orderDetails[0].reviewExists ? (
                        <button
                          onClick={() =>
                            navigate(`/my-reviews/${order.orderDetails[0].productId}/${order.orderDetails[0].optionId}`)
                          }
                          className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300"
                        >
                          내가 작성한 리뷰 보기
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/reviews/${order.orderDetails[0].productId}/${order.orderDetails[0].optionId}`)
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          리뷰 작성
                        </button>
                      )
                    ) : (
                      <span className="text-gray-400">배송 완료 후 가능</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 가격 포매팅 함수
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default OrderHistory;
