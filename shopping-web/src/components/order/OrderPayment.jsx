import { useState } from "react";
import { useMyContext } from "../../store/ContextApi";

const OrderPaymentPage = () => {
  const { cartItems } = useMyContext();
  const SHIPPING_COST = 3000;
  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [selectedValue, setSelectedValue] = useState("예치금");
  const paymentMethods = [
    { id: "bank", name: "무통장입금" },
    { id: "credit", name: "신용카드" },
    { id: "transfer", name: "실시간계좌 이체" },
    { id: "mobile", name: "휴대폰 결제" },
    { id: "samsung", name: "삼성PAY" },
    { id: "payco", name: "PAYCO" },
    { id: "kakaopay", name: "카카오PAY" },
    { id: "smilepay", name: "스마일PAY" },
  ];
  const [selectedMethod, setSelectedMethod] = useState("credit");

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    postalCode: "",
    baseAddress: "",
    detailAddress: "",
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: "",
    email: "",
    emailDomain: "",
    message: "",
  });

  const [formData2, setFormData2] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    postalCode: "",
    baseAddress: "",
    detailAddress: "",
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: "",
    email: "",
    emailDomain: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 맞지 않습니다.");
      return;
    }
    console.log("Form submitted", formData);
  };

  const handleSameOrderer = (event) => {
    setSameAsOrderer(event.target.checked);
    if (event.target.checked) {
      handleChange2({ target: { name: "name", value: formData.name } });
      handleChange2({
        target: { name: "phonePrefix", value: formData.phonePrefix },
      });
      handleChange2({
        target: { name: "phoneMiddle", value: formData.phoneMiddle },
      });
      handleChange2({
        target: { name: "phoneLast", value: formData.phoneLast },
      });
      console.log("ㅇㅋ");
    } else {
      handleChange2({ target: { name: "name", value: "" } });
      handleChange2({ target: { name: "phonePrefix", value: "" } });
      handleChange2({ target: { name: "phoneMiddle", value: "" } });
      handleChange2({ target: { name: "phoneLast", value: "" } });
      console.log("ㄴㄴ");
    }
    console.log("체크된 객체", sameAsOrderer);
  };

  const handleChange3 = (event) => {
    setSelectedValue(event.target.value);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        ORDER
      </h1>

      <div className=" bg-white  p-4">
        <h2 className="text-lg  text-gray-800 mb-3 font-semibold">주문상품</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-t text-sm text-center">
            <thead>
              <tr className="border-b">
                <th className="py-2"></th>
                <th className="py-2">상품정보</th>
                <th className="py-2">가격</th>
                <th className="py-2">수량</th>
                <th className="py-2">예상 적립금</th>
                <th className="py-2">배송구분</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b text-center text-gray-800"
                >
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-700">
                    {item.price.toLocaleString("ko-KR")}원
                  </td>
                  <td className="p-4 flex justify-center items-center mt-4">
                    <span className="mx-2 text-sm text-gray-900">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800 font-medium text-sm">
                    {item.points * item.quantity}P
                  </td>
                  <td className="p-4">기본배송</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      {/* 주문자 정보 */}
      <h2 className="text-lg  text-gray-800 mb-1 font-semibold">주문자 정보</h2>
      <form onSubmit={handleSubmit} className="  p-4 w-[870px]  ml-[-10px]">
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">이름</td>
              <td className="p-2 border-gray-200">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-300px; p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1 border-gray-200">주문조회 비밀번호 </td>
              <td className="p-2 border-gray-200">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-300px p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">주문조회 비밀번호 확인</td>
              <td className="p-2 border-gray-200">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-300px p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">휴대폰 번호</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <select
                  name="phonePrefix"
                  value={formData.phonePrefix}
                  onChange={handleChange}
                  className="w-100px p-1 border rounded border-gray-200 text-xs"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                </select>
                <span>-</span>
                <input
                  type="text"
                  name="phoneMiddle"
                  value={formData.phoneMiddle}
                  onChange={handleChange}
                  className="w-100px p-1 border rounded border-gray-200 text-xs"
                />
                <span>-</span>
                <input
                  type="text"
                  name="phoneLast"
                  value={formData.phoneLast}
                  onChange={handleChange}
                  className="w-100px p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">이메일</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
                <span>@</span>
                <input
                  type="text"
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                  required
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
                <select
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                >
                  <option value="직접입력">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="daum.net">daum.net</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        {/* <div className="mt-4 text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div> */}
        <br />
        <br />

        {/* 배송지 정보 */}

        <h2 className="text-lg  text-gray-800 mb-1 font-semibold">
          배송지 정보
        </h2>
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">이름</td>
              <td className="p-2 border-gray-200">
                <input
                  type="text"
                  name="name"
                  value={formData2.name}
                  onChange={handleChange2}
                  required
                  className="w-300px; p-1 border rounded border-gray-200 text-xs"
                />
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    onChange={handleSameOrderer}
                    className="mr-1"
                  />
                  주문자 정보와 동일
                </label>
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">휴대폰 번호</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <select
                  name="phonePrefix"
                  value={formData2.phonePrefix}
                  onChange={handleChange2}
                  className="w-100px p-1 border rounded border-gray-200 text-xs"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                </select>
                <span>-</span>
                <input
                  type="text"
                  name="phoneMiddle"
                  value={formData2.phoneMiddle}
                  onChange={handleChange2}
                  className="w-100px p-1 border rounded border-gray-200 text-xs"
                />
                <span>-</span>
                <input
                  type="text"
                  name="phoneLast"
                  value={formData2.phoneLast}
                  onChange={handleChange2}
                  className="w-100px p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">주소</td>
              <td className="p-2 border-gray-200 space-y-2">
                <input
                  type="text"
                  name="postalCode"
                  placeholder=""
                  value={formData2.postalCode}
                  onChange={handleChange2}
                  required
                  className="w- p-1 border rounded border-gray-200 text-xs"
                />
                <span>
                  <button
                    type="button"
                    onClick={handleChange2}
                    className="p-1 border rounded border-gray-200 text-xs bg-gray-100 hover:bg-gray-200 mr-2"
                  >
                    {formData2.postalCode ? formData2.postalCode : "우편번호"}
                  </button>
                </span>
                <input
                  type="text"
                  name="baseAddress"
                  placeholder="기본주소"
                  value={formData2.baseAddress}
                  onChange={handleChange2}
                  required
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
                <input
                  type="text"
                  name="detailAddress"
                  placeholder="상세주소"
                  value={formData2.detailAddress}
                  onChange={handleChange2}
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200 text-left">배송 메세지</td>
              <td className="p-2 border-gray-200 flex justify-center items-center">
                <textarea
                  name="message"
                  value={formData2.message}
                  onChange={handleChange2}
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {/* 환불방법 */}
      <div className="p-4 w-full max-w-md">
        <h2 className="text-lg  text-gray-800 mb-1 font-semibold">
          품절시 환불방법
        </h2>

        <label className="mr-4">
          <input
            type="radio"
            value="deposit"
            checked={selectedValue === "deposit"}
            onChange={handleChange3}
          />
          예치금
        </label>

        <label className="mr-4">
          <input
            type="radio"
            value="change"
            checked={selectedValue === "change"}
            onChange={handleChange3}
          />
          상품변경
        </label>

        <label className="mr-4">
          <input
            type="radio"
            value="payment"
            checked={selectedValue === "payment"}
            onChange={handleChange3}
          />
          결제수단 환불
        </label>

        <p className="mt-2 text-sm text-gray-600">
          {selectedValue === "deposit"
            ? "추후 환불 시 쿠폰조건이 해지될 경우 할인금액이 차감되어 결제방법으로 환불됩니다."
            : ""}
          {selectedValue === "change"
            ? "상품 변경을 선택하시면 주문자 정보를 통해 연락드린 후 교환을 도와드리겠습니다."
            : ""}
          {selectedValue === "payment"
            ? "결제수단 환불을 선택하시면 별도의 연락없이 선택하신 결제방법으로 환불해 드립니다."
            : ""}
        </p>
      </div>
      {/* 결제방법 */}
      <div className="p-3 max-w-xl mx-300px w-500px">
        <h2 className="text-lg  text-gray-800 mb-1 font-semibold">
          결제방법 선택
        </h2>
        <div className="grid grid-cols-4 gap-2 ">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-3 flex flex-col items-center cursor-pointer rounded-lg border ${
                selectedMethod === method.id
                  ? "bg-gray-800 text-white"
                  : "bg-white"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="mt-3 mb-3 text-sm">{method.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {selectedMethod === "bank" && (
            <div className="mt-4 w-full ">
              <hr className="border-0 " />
              <h3 className="text-md font-semibold mb-2">무통장입금 정보</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium">입금은행</label>
                <select className="w-full p-2 border ">
                  <option>입금은행 선택</option>
                  <option>국민은행</option>
                  <option>신한은행</option>
                  <option>우리은행</option>
                  <option>하나은행</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">입금자</label>
                <input
                  type="text"
                  className="w-full p-2 border "
                  placeholder="입금자명"
                />
                <p className="text-xs text-gray-600"></p>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">입금예정</label>
                <input
                  type="date"
                  className="w-full p-2 border "
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          )}
        </p>
      </div>

      {/* 결제창 */}
      <div className=" ml-1 p-4 bg-white  w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">결제정보</h2>
        <div className="text-gray-700 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span>총 상품금액</span>
            <span>{getTotalPrice().toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>배송료</span>
            <span>+ {SHIPPING_COST.toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg text-gray-900">
            <span>총 결제금액</span>
            <span>
              {(getTotalPrice() + SHIPPING_COST).toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
        <div className="mt-6 flex space-x-2">
          {/* <div className="mt-4 text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div> */}
          <button
            type="submit"
            className="w-1/2 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            결제하기
          </button>
          <button className="w-1/2  text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-900 border-1">
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentPage;
