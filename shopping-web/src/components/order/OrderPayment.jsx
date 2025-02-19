import { useEffect, useState } from "react";
import { useMyContext } from "../../store/ContextApi";

const OrderPaymentPage = () => {
  const { cartItems, currentUser } = useMyContext();
  console.log(currentUser);
  // console.log(currentUser.points);
  const SHIPPING_COST = 3000;
  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [selectedValue, setSelectedValue] = useState("적립금");
  const [selectedMethod, setSelectedMethod] = useState("credit");
  const [point, setPoint] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  // const balance = 5000; // 예시보유 잔액

  //포인트 적립
  useEffect(() => {
    if (currentUser?.points) {
      setPoint(currentUser.points);
    }
  }, [currentUser]);

  //포인트 전액사용 함수
  const handleFullUse = () => {
    setPoint(currentUser?.points || 0);
  };

  //결제 메소드
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

  //전액이 보유 포인트를 넘지 않도록
  const handlePointChange = (e) => {
    const value = Number(e.target.value);
    if (value > (currentUser?.points || 0)) {
      setPoint(currentUser?.points || 0);
    } else if (value < 0) {
      setPoint(0);
    } else {
      setPoint(value);
    }
  };

  //주문자 정보
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    phoneNumber: currentUser?.phoneNumber || "",
    postcode: currentUser?.postcode || "",
    address: currentUser?.address || "",
    detailAddress: currentUser?.detailAddress || "",
    extraAddress: currentUser?.extraAddress || "",
  });

  //배송지 정보
  const [formData2, setFormData2] = useState({ ...formData });

  useEffect(() => {
    if (sameAsOrderer) {
      setFormData2({ ...formData });
    } else {
      setFormData2({
        username: "",
        email: "",
        phoneNumber: "",
        postcode: "",
        address: "",
        detailAddress: "",
        extraAddress: "",
      });
    }
  }, [sameAsOrderer, formData]);

  //주문자 정보 저장
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //배송지 정보 저장
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
  };

  // 체크박스 핸들러: 주문자 정보와 동일하게 설정
  const handleSameOrderer = (event) => {
    setSameAsOrderer(event.target.checked);
    if (event.target.checked) {
      setFormData2({ ...formData }); // 주문자 정보 복사
    } else {
      setFormData2({
        username: "",
        email: "",
        phoneNumber: "",
        postcode: "",
        address: "",
        detailAddress: "",
        extraAddress: "",
      }); // 체크 해제 시 초기화
    }
  };

  //우편번호 검색
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAddressSearch = () => {
    if (!window.daum) {
      alert("주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = data.roadAddress || data.jibunAddress;
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = `(${extraAddr})`;
          }
        }

        setFormData2((prevState) => ({
          ...prevState,
          postcode: data.zonecode,
          address: addr,
          extraAddress: extraAddr,
          detailAddress: "",
        }));
      },
    }).open();
  };

  const handleChange3 = (event) => {
    setSelectedValue(event.target.value);
  };

  const getTotalPrice = () => {
    return (
      cartItems?.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) || 0
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
      <h2 className="text-lg  text-gray-800  font-semibold ml-1">
        주문자 정보
      </h2>
      <form className="  p-4 w-[870px]  ml-[-10px]">
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200 mt-0.5">
              <td className="p-2 border-gray-200">이름</td>
              <td className="p-2 border-gray-200">
                <input
                  type="text"
                  name="username"
                  value={currentUser?.username}
                  onChange={handleChange}
                  required
                  className="w-300px; p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">주소</td>
              <td className="p-2 border-gray-200 space-y-2">
                <input
                  type="text"
                  name="postCode"
                  placeholder=""
                  value={currentUser?.postcode}
                  onChange={handleChange}
                  required
                  className="w- p-1 border rounded border-gray-200 text-xs"
                />
                {/* <span>
                  <button
                    type="button"
                    onClick={() => alert("우편번호 검색 기능 추가 필요")}
                    className="p-1 border rounded border-gray-200 text-xs bg-gray-100 hover:bg-gray-200 mr-2"
                  >
                    우편번호 찾기
                  </button>
                </span> */}
                <input
                  type="text"
                  name="address"
                  placeholder="기본주소"
                  value={currentUser?.address}
                  onChange={handleChange}
                  required
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
                <input
                  type="text"
                  name="detailAddress"
                  placeholder="상세주소"
                  value={currentUser?.detailAddress}
                  onChange={handleChange}
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
                <span>
                  <input
                    type="text"
                    name="extraAddress"
                    placeholder="추가주소"
                    value={currentUser?.extraAddress}
                    onChange={handleChange}
                    className="w-full p-1 border rounded border-gray-200 text-xs"
                  />
                </span>
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">휴대폰 번호</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <input
                  type="text"
                  name="phoneNumber"
                  value={currentUser?.phoneNumber}
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
                  value={currentUser?.email}
                  onChange={handleChange}
                  required
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
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
                  value={formData2.username}
                  onChange={handleChange2}
                  required
                  className="w-300px; p-1 border rounded border-gray-200 text-xs"
                />
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={sameAsOrderer}
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
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData2.phoneNumber}
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
                  name="postcode"
                  placeholder=""
                  value={formData2.postcode}
                  onChange={handleChange2}
                  required
                  className="w- p-1 border rounded border-gray-200 text-xs"
                />
                <span>
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="p-1 border rounded border-gray-200 text-xs bg-gray-100 hover:bg-gray-200 mr-2"
                  >
                    우편번호 찾기
                  </button>
                </span>
                <input
                  type="text"
                  name="address"
                  placeholder="기본주소"
                  value={formData2.address}
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
                <input
                  type="text"
                  name="extraAddress"
                  placeholder="추가주소"
                  value={formData2.extraAddress}
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
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  className="w-full p-1 border rounded border-gray-200 text-xs"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      {/* 적립금 */}
      <h2 className="text-lg text-gray-800 font-semibold mb-2 mt-3">
        할인/적립금
      </h2>
      <div className="p-2 border border-gray-200 w-210 ml-1 mt-1">
        <div className="mb-2 flex justify-between items-center">
          <label className="text-gray-700">적립금</label>
          <button
            onClick={handleFullUse}
            className="bg-gray-700 text-white py-2 rounded-lg font-small text-xs"
            disabled={!currentUser?.points}
          >
            <span>전액 사용</span>
          </button>
        </div>
        <div className="flex border rounded p-2 items-center">
          <input
            type="number"
            value={point}
            onChange={handlePointChange}
            className="flex-grow outline-none"
            placeholder="0"
          />
          <span className="text-gray-500">원</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          보유 잔액 {currentUser?.points?.toLocaleString()}원
        </p>
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p className="text-gray-700 text-sm">
            적립금은 사용제한 없이 언제든 결제가 가능합니다.
          </p>
        </div>
        <div className="mt-4 border-t pt-2 flex justify-between">
          <span className="text-gray-700">적용금액</span>
          <span className="text-gray-700">{point.toLocaleString()}원</span>
        </div>
      </div>
      {/* 환불방법 */}
      <div className="p-4 w-full max-w-md">
        <h2 className="text-lg  text-gray-800 mb-1 font-semibold mt-5 mr-1">
          품절시 환불방법
        </h2>

        <label className="mr-4">
          <input
            type="radio"
            value="point"
            checked={selectedValue === "point"}
            onChange={handleChange3}
          />
          적립금
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
          {selectedValue === "point"
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
        <h2 className="text-lg  text-gray-800 mb-2 font-semibold mt-4">
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
        <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-4">
          결제정보
        </h2>
        <div className="text-gray-700 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span>총 상품금액</span>
            <span>{getTotalPrice().toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>배송료</span>
            <span>+ {SHIPPING_COST.toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>적립금</span>
            <span>- {point.toLocaleString("ko-KR")}원</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg text-gray-900">
            <span>총 결제금액</span>
            <span>
              {(getTotalPrice() + SHIPPING_COST - point).toLocaleString(
                "ko-KR"
              )}
              원
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
