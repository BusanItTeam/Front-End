import React, { useState, useEffect } from "react";
import api from "../../services/Api";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const backendURL = "http://localhost:8080";

  useEffect(() => {
    fetchOrders();
  }, []);

  // 주문 목록을 가져오는 함수
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders"); // 실제 API 호출
      console.log("뿅뿅", response.data); // 응답 데이터 확인
      setOrders(response.data); // 주문 목록을 상태에 저장
    } catch (error) {
      console.error("주문 목록을 불러오는데 실패했습니다.", error);
    }
  };

  // 주문을 클릭했을 때, 상세 정보와 배송 상태를 설정하는 함수
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDeliveryStatus(order.status); // 주문의 현재 상태를 배송 상태로 설정
  };

  // 배송 상태를 변경하는 함수
  const handleDeliveryStatusChange = (e) => {
    setDeliveryStatus(e.target.value);
  };

  // 배송 상태 업데이트 함수
  const updateDeliveryStatus = async () => {
    if (!selectedOrder) return;

    try {
      await api.put(`/orders/${selectedOrder.id}`, { status: deliveryStatus }); // 배송 상태를 업데이트
      fetchOrders(); // 상태 업데이트 후 다시 주문 목록을 가져옵니다.
      setSelectedOrder(null);
      alert("배송 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("배송 상태 업데이트에 실패했습니다.", error);
    }
  };

  // 환불 처리 함수
  const handleRefund = async (orderId) => {
    try {
      await api.post(`/refunds/${orderId}`);
      fetchOrders();
      alert("환불이 완료되었습니다.");
    } catch (error) {
      console.error("환불 처리에 실패했습니다.", error);
    }
  };

  // 교환 처리 함수
  const handleExchange = async (orderId) => {
    try {
      await api.post(`/exchanges/${orderId}`);
      fetchOrders();
      alert("교환이 완료되었습니다.");
    } catch (error) {
      console.error("교환 처리에 실패했습니다.", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-center font-bold mb-8">주문 및 배송 관리</h2>

      {/* 주문 목록 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">주문 목록</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">주문 ID</th>
              <th className="border p-2">고객명</th>
              <th className="border p-2">주문일</th>
              <th className="border p-2">총액</th>
              <th className="border p-2">배송 상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.userId + order.totalPrice} onClick={() => handleOrderClick(order)} className="hover:bg-gray-100 cursor-pointer">
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">{new Date().toLocaleDateString()}</td> {/* 현재 날짜로 처리 */}
                <td className="border p-2">{order.totalPrice + order.shippingCost}</td>
                <td className="border p-2">{order.status}</td>
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
            <p>주문 ID: {selectedOrder.orderId}</p>
            <p>고객명: {selectedOrder.name}</p>
            <p>수령인: {selectedOrder.recipient}</p>
            <p>배송 주소: {selectedOrder.shippingAddress}</p>
            <p>배송 메세지: {selectedOrder.orderMessage}</p>
            <p>결제 방법: {selectedOrder.paymentMethod}</p>
            <p>환불 방법: {selectedOrder.refundeMethod}</p>
            <p>배송비: {selectedOrder.shippingCost}</p>
            <p>상품구매액: {selectedOrder.totalPrice - selectedOrder.shippingCost}</p>
            <p>총액: {selectedOrder.totalPrice}</p>
          </div>

          {/* 주문 상세 항목 (orderDetails) */}
          <h4 className="text-lg font-semibold">주문 상세 항목</h4>
          <table className="w-full border-collapse border mt-4 mb-8">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">번호</th>
                <th className="border p-2">이미지</th>
                <th className="border p-2">상품명</th>
                <th className="border p-2">가격</th>
                <th className="border p-2">수량</th>
                <th className="border p-2">옵션</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.orderDetails.map((detail, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    <img src={`${backendURL}${detail.image}`} alt={detail.image} className="w-16 h-16 mr-2 inline-block" />
                  </td>
                  <td className="border p-2">{detail.productName}</td>
                  <td className="border p-2">{detail.price}</td>
                  <td className="border p-2">{detail.quantity}</td>
                  <td className="border p-2">
                    color: {detail.optionColor}, size: {detail.optionSize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 배송 상태 업데이트 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">배송 상태 변경:</label>
            <select value={deliveryStatus} onChange={handleDeliveryStatusChange} className="border p-2 rounded">
              <option value="결제 완료">결제 완료</option>
              <option value="배송 준비중">배송 준비중</option>
              <option value="배송중">배송중</option>
              <option value="배송 완료">배송 완료</option>
            </select>
            <button onClick={updateDeliveryStatus} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
              배송 상태 업데이트
            </button>
          </div>

          {/* 반품/교환 처리 */}
          <div>
            <button onClick={() => handleRefund(selectedOrder.userId)} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              환불 처리
            </button>
            <button onClick={() => handleExchange(selectedOrder.userId)} className="bg-green-500 text-white px-4 py-2 rounded">
              교환 처리
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
