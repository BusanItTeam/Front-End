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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get("/orders/history", {
          // 백엔드 API 엔드포인트 확인 필요
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
        toast.error("주문 내역을 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center py-4">Loading order history...</div>;
  }

  // 주문 내역이 없는 경우 메시지 표시
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">주문 내역</h2>
        <div className="text-center py-4">주문한 내역이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">주문 내역</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 번호
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 일자
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품 정보
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                총 결제 금액
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                배송 상태
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                리뷰 작성
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-4 py-2 whitespace-nowrap">{order.orderId}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.orderItems.map((item) => (
                    <div key={item.orderItemId} className="mb-2">
                      {item.productName} - {item.quantity}개
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.deliveryStatus}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.deliveryStatus === "배송 완료" ? (
                    <button
                      onClick={() =>
                        navigate(`/review/${order.orderItems[0].orderItemId}`)
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      리뷰 쓰러 가기
                    </button>
                  ) : (
                    "배송 완료 후 작성 가능"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};
