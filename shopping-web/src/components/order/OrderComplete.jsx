import { Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

const OrderComplete = () => {
  const { cartItems, currentUser } = useMyContext();
  const SHIPPING_COST = 3000;
  const getTotalPrice = () => {
    return cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  };

  return (
    <div className="p-10 max-w-5xl mx-auto mt-10 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">🎉 주문이 완료되었습니다!</h1>

      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl text-gray-800 mb-4 font-bold border-b pb-2">
          주문 상세
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="py-3">상품 이미지</th>
                <th className="py-3">상품명</th>
                <th className="py-3">가격</th>
                <th className="py-3">수량</th>
                <th className="py-3">적립금</th>
                <th className="py-3">주문 상태</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4 text-gray-700">
                    {item.price.toLocaleString("ko-KR")}원
                  </td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4 text-gray-800 font-medium text-sm">
                    {item.points * item.quantity}P
                  </td>
                  <td className="p-4 text-yellow-600 font-semibold">
                    🚚 배송 준비 중
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl text-gray-800 mb-4 font-bold border-b pb-2">결제 정보</h2>
        <div className="text-gray-700 text-lg">
          <div className="flex justify-between py-2 border-b">
            <span>총 상품금액</span>
            <span>{getTotalPrice().toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>배송료</span>
            <span>+ {SHIPPING_COST.toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-2xl text-gray-900">
            <span>총 결제금액</span>
            <span>{(getTotalPrice() + SHIPPING_COST).toLocaleString("ko-KR")}원</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl text-gray-800 mb-4 font-bold border-b pb-2">주문자 정보</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-lg">
          <div className="flex items-center mb-2">
            <span className="font-semibold w-32">👤 이름:</span>
            <span>{currentUser?.username}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-semibold w-32">📧 이메일:</span>
            <span>{currentUser?.email}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-semibold w-32 whitespace-nowrap">📞 전화번호:</span>
            <span className="truncate">{currentUser?.phoneNumber}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold w-32">🏠 주소:</span>
            <span>{currentUser?.addresses?.[0]?.address || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/" className="w-1/2 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 text-center text-lg">
          홈으로 이동
        </Link>
      </div>
    </div>
  );
};

export default OrderComplete;
