import React, { useState, useEffect } from "react";
import api from "../../services/Api";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // const response = await api.get("/orders");
      // setOrders(response.data);

      // 더미 데이터
      const dummyOrders = [
        {
          id: 1,
          customerName: "홍길동",
          orderDate: "2024-05-01",
          totalAmount: 55000,
          paymentMethod: "신용카드",
          shippingAddress: "서울특별시 강남구",
          deliveryStatus: "결제 완료",
        },
        {
          id: 2,
          customerName: "김철수",
          orderDate: "2024-05-02",
          totalAmount: 72000,
          paymentMethod: "무통장 입금",
          shippingAddress: "경기도 성남시",
          deliveryStatus: "배송 준비중",
        },
        {
          id: 3,
          customerName: "이영희",
          orderDate: "2024-05-03",
          totalAmount: 38000,
          paymentMethod: "신용카드",
          shippingAddress: "대전광역시 서구",
          deliveryStatus: "배송중",
        },
        {
          id: 4,
          customerName: "박지성",
          orderDate: "2024-05-04",
          totalAmount: 112000,
          paymentMethod: "신용카드",
          shippingAddress: "부산광역시 해운대구",
          deliveryStatus: "배송 완료",
        },
        {
          id: 5,
          customerName: "최민수",
          orderDate: "2024-05-05",
          totalAmount: 68000,
          paymentMethod: "무통장 입금",
          shippingAddress: "강원도 춘천시",
          deliveryStatus: "결제 완료",
        },
      ];
      setOrders(dummyOrders);
    } catch (error) {
      console.error("주문 목록을 불러오는데 실패했습니다.", error);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDeliveryStatus(order.deliveryStatus);
  };

  const handleDeliveryStatusChange = (e) => {
    setDeliveryStatus(e.target.value);
  };

  const updateDeliveryStatus = async () => {
    if (!selectedOrder) return;

    try {
      // await api.put(`/orders/${selectedOrder.id}`, { deliveryStatus });
      // fetchOrders();
      setSelectedOrder(null);
      alert("배송 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("배송 상태 업데이트에 실패했습니다.", error);
    }
  };

  const handleRefund = async (orderId) => {
    try {
      // await api.post(`/refunds/${orderId}`);
      // fetchOrders();
      alert("환불이 완료되었습니다.");
    } catch (error) {
      console.error("환불 처리에 실패했습니다.", error);
    }
  };

  const handleExchange = async (orderId) => {
    try {
      // await api.post(`/exchanges/${orderId}`);
      // fetchOrders();
      alert("교환이 완료되었습니다.");
    } catch (error) {
      console.error("교환 처리에 실패했습니다.", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">주문 및 배송 관리</h2>

      {/* 주문 목록 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">주문 목록</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">주문 ID</th>
              <th className="border p-2">주문자</th>
              <th className="border p-2">주문일</th>
              <th className="border p-2">총액</th>
              <th className="border p-2">배송 상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.customerName}</td>
                <td className="border p-2">{order.orderDate}</td>
                <td className="border p-2">{order.totalAmount}</td>
                <td className="border p-2">{order.deliveryStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 주문 상세 정보 및 배송 상태 업데이트 */}
      {selectedOrder && (
        <div>
          <h3 className="text-xl font-semibold mb-2">주문 상세 정보</h3>
          <div className="mb-4">
            <p>주문 ID: {selectedOrder.id}</p>
            <p>주문자: {selectedOrder.customerName}</p>
            <p>주문일: {selectedOrder.orderDate}</p>
            <p>총액: {selectedOrder.totalAmount}</p>
            <p>결제 방법: {selectedOrder.paymentMethod}</p>
            <p>주소: {selectedOrder.shippingAddress}</p>
          </div>

          {/* 배송 상태 업데이트 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">배송 상태 변경:</label>
            <select
              value={deliveryStatus}
              onChange={handleDeliveryStatusChange}
              className="border p-2 rounded"
            >
              <option value="결제 완료">결제 완료</option>
              <option value="배송 준비중">배송 준비중</option>
              <option value="배송중">배송중</option>
              <option value="배송 완료">배송 완료</option>
            </select>
            <button
              onClick={updateDeliveryStatus}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              배송 상태 업데이트
            </button>
          </div>

          {/* 반품/교환 처리 */}
          <div>
            <button
              onClick={() => handleRefund(selectedOrder.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              환불 처리
            </button>
            <button
              onClick={() => handleExchange(selectedOrder.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              교환 처리
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
