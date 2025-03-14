import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminLayout from "./AdminLayout";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("PENDING");
  const backendURL = "http://localhost:8080";

  useEffect(() => {
    fetchOrders();
  }, []);

  // 주문 목록을 가져오는 함수
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("주문 목록을 불러오는데 실패했습니다.", error);
    }
  };

  // 주문을 클릭했을 때, 상세 정보와 배송 상태를 설정하는 함수
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDeliveryStatus(order.status);
  };

  // 배송 상태를 한글로 변환하는 매핑 객체
  const statusMap = {
    PENDING: "입금대기중",
    PAID: "결제완료",
    READY_FOR_SHIPPING: "배송준비중",
    SHIPPING: "배송중",
    SHIPPED: "배송완료",
  };

  const koreanToEnglishMap = {
    입금대기중: "PENDING",
    결제완료: "PAID",
    배송준비중: "READY_FOR_SHIPPING",
    배송중: "SHIPPING",
    배송완료: "SHIPPED",
  };

  // 배송 상태를 변경하는 함수
  const handleDeliveryStatusChange = (e) => {
    const selectedKoreanStatus = e.target.value;
    setDeliveryStatus(koreanToEnglishMap[selectedKoreanStatus]);
  };

  // 배송 상태 업데이트 함수
  const updateDeliveryStatus = async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      await api.put(
        `/orders/${selectedOrder.orderId}/status`,
        { status: deliveryStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
      toast.success("업데이트 성공");
    } catch (error) {
      console.error("업데이트 실패:", error.response?.data);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          주문 및 배송 관리
        </h2>

        {/* 주문 목록 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            주문 목록
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-6">주문 ID</th>
                  <th className="py-3 px-6">고객명</th>
                  <th className="py-3 px-6">주문일</th>
                  <th className="py-3 px-6">총액</th>
                  <th className="py-3 px-6">배송 상태</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50 cursor-pointer transition duration-300"
                    onClick={() => handleOrderClick(order)}
                  >
                    <td className="border-t py-3 px-6">{order.orderId}</td>
                    <td className="border-t py-3 px-6">{order.name}</td>
                    <td className="border-t py-3 px-6">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="border-t py-3 px-6">{order.totalPrice}</td>
                    <td className="border-t py-3 px-6">
                      <span
                        className={`inline-block py-1 px-3 rounded-full text-sm 
                        ${
                          order.status === "SHIPPED"
                            ? "bg-green-200 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-200 text-yellow-800"
                            : order.status === "PAID"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {statusMap[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 주문 상세 정보 및 배송 상태 업데이트 */}
        {selectedOrder && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              주문 상세 정보
            </h3>
            <div className="space-y-4 mb-6">
              <p>
                <strong>주문 ID:</strong> {selectedOrder.orderId}
              </p>
              <p>
                <strong>고객명:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>수령인:</strong> {selectedOrder.recipient}
              </p>
              <p>
                <strong>배송 주소:</strong> {selectedOrder.shippingAddress}
              </p>
              <p>
                <strong>배송 메세지:</strong> {selectedOrder.orderMessage}
              </p>
              <p>
                <strong>결제 방법:</strong> {selectedOrder.paymentMethod}
              </p>
              <p>
                <strong>환불 방법:</strong> {selectedOrder.refundeMethod}
              </p>
              <p>
                <strong>배송비:</strong> {selectedOrder.shippingCost}
              </p>
              <p>
                <strong>상품구매액:</strong>{" "}
                {selectedOrder.totalPrice - selectedOrder.shippingCost}
              </p>
              <p>
                <strong>총액:</strong> {selectedOrder.totalPrice}
              </p>
            </div>

            {/* 주문 상세 항목 (orderDetails) */}
            <h4 className="text-lg font-semibold text-gray-800">
              주문 상세 항목
            </h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-6">번호</th>
                    <th className="py-3 px-6">이미지</th>
                    <th className="py-3 px-6">상품명</th>
                    <th className="py-3 px-6">가격</th>
                    <th className="py-3 px-6">수량</th>
                    <th className="py-3 px-6">옵션</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="border-t py-3 px-6">{index + 1}</td>
                      <td className="border-t py-3 px-6">
                        <img
                          src={`${backendURL}${detail.image}`}
                          alt={detail.productName}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="border-t py-3 px-6">
                        {detail.productName}
                      </td>
                      <td className="border-t py-3 px-6">{detail.price}</td>
                      <td className="border-t py-3 px-6">{detail.quantity}</td>
                      <td className="border-t py-3 px-6">
                        {detail.optionColor} / {detail.optionSize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 배송 상태 변경 */}
            <div className="flex items-center space-x-4">
              <label className="font-semibold text-gray-800">
                배송 상태 변경:
              </label>
              <select
                value={statusMap[deliveryStatus] || "입금대기중"}
                onChange={handleDeliveryStatusChange}
                className="border py-2 px-4 rounded-lg"
              >
                {Object.values(statusMap).map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={updateDeliveryStatus}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
              >
                상태 업데이트
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default OrderManagement;
