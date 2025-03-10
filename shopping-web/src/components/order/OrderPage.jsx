import { useEffect, useState } from "react";
import { useMyContext } from "../../store/ContextApi";
import Api from "../../services/Api";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const OrderPage = () => {
  const { cartItems, currentUser, setCurrentUser } = useMyContext();
  console.log("커런트", currentUser);
  const SHIPPING_COST = 3000;

  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [selectedValue, setSelectedValue] = useState("적립금");
  const [selectedMethod, setSelectedMethod] = useState("credit");
  const [point, setPoint] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");

  const [directBuyItem, setDirectBuyItem] = useState(null); // 로컬 스토리지에서 가져온 상품 정보를 저장할 상태

  // ✅ 바로 구매 상품 정보 가져오기
  useEffect(() => {
    const storedDirectBuyInfo = localStorage.getItem("directBuyInfo");
    if (storedDirectBuyInfo) {
      const directBuyInfo = JSON.parse(storedDirectBuyInfo);
      setDirectBuyItem(directBuyInfo);
      localStorage.removeItem("directBuyInfo"); // 정보 사용 후 삭제
      console.log("Direct Buy Item Info:", directBuyInfo);
    }
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    postcode: "N/A",
    address: "N/A",
    detailAddress: "N/A",
    extraAddress: "N/A",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        postcode: currentUser.addresses?.[0]?.postcode || "N/A",
        address: currentUser.addresses?.[0]?.address || "N/A",
        detailAddress: currentUser.addresses?.[0]?.detailAddress || "N/A",
        extraAddress: currentUser.addresses?.[0]?.extraAddress || "N/A",
      });
    }
  }, [currentUser]); // `currentUser`가 변경될 때마다 `formData` 업데이트

  const [formData2, setFormData2] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    postcode: "",
    address: "",
    detailAddress: "",
    extraAddress: "",
  });

  // ✅ 백엔드에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await Api.get("/auths/user");
        console.log(response.data);
        const data = response.data;
        //const data = await response.json();
        setCurrentUser(data); // Context API에 저장

        setPoint(data.points || 0); // 포인트 설정

        // ✅ UserInfoResponse에서 첫 번째 주소 정보 가져오기
        const userAddress = currentUser?.addresses?.[0] || {};

        // ✅ formData 상태 업데이트
        const updatedFormData = {
          username: data.username || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          postcode: userAddress.postcode || "",
          address: userAddress.address || "",
          detailAddress: userAddress.detailAddress || "",
          extraAddress: userAddress.extraAddress || "",
        };

        setFormData(updatedFormData);
        // setFormData2(updatedFormData); // 배송지 정보도 초기화
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  // ✅ 결제하기 버튼 클릭 시 주문저장
  const handleOrderSubmit = async () => {
    if (!currentUser?.id || cartItems.length === 0) {
      alert("유효한 사용자 또는 장바구니 상품이 없습니다.");
      return;
    }

    const orderData = {
      userId: currentUser.id,
      totalPrice: getTotalPrice() + SHIPPING_COST - point,
      status: "배송준비중",
    };

    try {
      const response = await Api.post("/orders/create", orderData);
      console.log("Order Created:", response.data);
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문을 생성하는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 주문자 정보와 배송지 정보 동기화
  useEffect(() => {
    if (sameAsOrderer) {
      setFormData2({ ...formData });
    }
  }, [sameAsOrderer, formData]);

  // ✅ 포인트 전액 사용 함수
  const handleFullUse = () => {
    setPoint(currentUser?.points || 0);
  };

  // ✅ 포인트 입력 값 제한 함수 (onChange 이벤트 적용)
  const handlePointChange = (event) => {
    const value = Number(event.target.value);
    if (value < 0) {
      setPoint(0);
    }
  };

  // ✅ 주문자 정보 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 배송지 정보 변경 핸들러
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ "주문자 정보와 동일" 체크박스 핸들러
  const handleSameOrderer = (event) => {
    const checked = event.target.checked;
    setSameAsOrderer(checked);

    if (checked) {
      setFormData2({ ...formData }); // ✅ Immediately copy orderer info
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
  };
  // ✅ 결제 방법 리스트
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

  // ✅ 전체 상품 가격 계산
  const getTotalPrice = () => {
    return cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  };

  //포인트 적립
  useEffect(() => {
    if (currentUser?.points) {
      setPoint(currentUser.points);
    }
  }, [currentUser]);

  //우편번호 검색
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  //주소 검색 기능

  // const handleAddressSearch = () => {
  //   if (!window.daum) {
  //     alert("주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
  //     return;
  //   }

  //   new window.daum.Postcode({
  //     oncomplete: function (data) {
  //       let addr = data.roadAddress || data.jibunAddress; // 도로명 주소 또는 지번 주소
  //       let extraAddr = "";

  //       if (data.userSelectedType === "R") {
  //         if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
  //           extraAddr += data.bname;
  //         }
  //         if (data.buildingName !== "" && data.apartment === "Y") {
  //           extraAddr +=
  //             extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
  //         }
  //         if (extraAddr !== "") {
  //           extraAddr = `(${extraAddr})`;
  //         }
  //       }

  //       setValue("postcode", data.zonecode); // 우편번호
  //       setValue("address", addr); // 주소
  //       setValue("extraAddress", extraAddr); // 참고 항목
  //       setValue("detailAddress", ""); // 상세 주소 초기화
  //     },
  //   }).open();
  // };
  const handleAddressSearch = () => {
    if (!window.daum) {
      alert("주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = data.roadAddress || data.jibunAddress; // 도로명 주소 또는 지번 주소
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr += extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = `(${extraAddr})`;
          }
        }

        // 배송지 정보 상태 업데이트
        setFormData2((prevState) => ({
          ...prevState,
          postcode: data.zonecode, // 우편번호
          address: addr, // 기본 주소
          extraAddress: extraAddr, // 참고 주소
          detailAddress: "", // 상세 주소는 빈칸으로 두기
        }));
      },
    }).open();
  };

  //환불방법
  const handleChange3 = (event) => {
    setSelectedValue(event.target.value);
  };

  // 예상 적립금 계산 함수
  const calculateEstimatedPoints = () => {
    if (directBuyItem && directBuyItem.product) {
      return Math.floor(directBuyItem.product.price * 0.01); // 예시: 상품 가격의 1% 적립
    }
    return 0;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">ORDER</h1>

      <div className=" bg-white  p-4">
        <h2 className="text-lg  text-gray-800 mb-3 font-semibold">주문상품</h2>

        <div className="overflow-x-auto">
          {/* 바로 구매 상품 정보 테이블 */}
          {directBuyItem && directBuyItem.product && (
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">상품 정보</th>
                  <th className="px-4 py-2">가격</th>
                  <th className="px-4 py-2">수량</th>
                  <th className="px-4 py-2">예상 적립금</th>
                  <th className="px-4 py-2">배송 구분</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{directBuyItem.product.name}</td>
                  <td className="border px-4 py-2">{directBuyItem.product.price}</td>
                  <td className="border px-4 py-2">{directBuyItem.quantity}</td>
                  <td className="border px-4 py-2">{calculateEstimatedPoints()}</td>
                  <td className="border px-4 py-2">일반 배송</td>
                </tr>
              </tbody>
            </table>
          )}
          {/* 
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
                <tr key={item.id} className="border-b text-center text-gray-800">
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-700">{item.price.toLocaleString("ko-KR")}원</td>
                  <td className="p-4 flex justify-center items-center mt-4">
                    <span className="mx-2 text-sm text-gray-900">{item.quantity}</span>
                  </td>
                  <td className="p-4 text-gray-800 font-medium text-sm">{item.points * item.quantity}P</td>
                  <td className="p-4">기본배송</td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      </div>
      <br />
      {/* 주문자 정보 */}
      <h2 className="text-lg  text-gray-800  font-semibold ml-1">주문자 정보</h2>
      <form className="  p-4 w-[870px]  ml-[-10px]">
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200 mt-0.5">
              <td className="p-2 border-gray-200">이름</td>
              <td className="p-2 border-gray-200">
                <input type="text" name="username" value={currentUser?.username} onChange={handleChange} required className="w-300px; p-1 border rounded border-gray-200 text-xs" />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">주소</td>
              <td className="p-2 border-gray-200 space-y-2">
                <input type="text" name="postcode" placeholder="" value={formData.postcode} onChange={handleChange} required className="w- p-1 border rounded border-gray-200 text-xs" />
                {/* <span>
                  <button
                    type="button"
                    onClick={() => alert("우편번호 검색 기능 추가 필요")}
                    className="p-1 border rounded border-gray-200 text-xs bg-gray-100 hover:bg-gray-200 mr-2"
                  >
                    우편번호 찾기
                  </button>
                </span> */}
                <input type="text" name="address" placeholder="기본주소" value={formData.address} onChange={handleChange} required className="w-full p-1 border rounded border-gray-200 text-xs" />
                <input type="text" name="detailAddress" placeholder="상세주소" value={formData.detailAddress} onChange={handleChange} className="w-full p-1 border rounded border-gray-200 text-xs" />
                <span>
                  <input type="text" name="extraAddress" placeholder="추가주소" value={formData.extraAddress} onChange={handleChange} className="w-full p-1 border rounded border-gray-200 text-xs" />
                </span>
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">휴대폰 번호</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <input type="text" name="phoneNumber" value={currentUser?.phoneNumber} onChange={handleChange} className="w-100px p-1 border rounded border-gray-200 text-xs" />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">이메일</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <input type="text" name="email" value={currentUser?.email} onChange={handleChange} required className="w-full p-1 border rounded border-gray-200 text-xs" />
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

        <h2 className="text-lg  text-gray-800 mb-1 font-semibold">배송지 정보</h2>
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">이름</td>
              <td className="p-2 border-gray-200">
                <input type="text" name="name" value={formData2.username} onChange={handleChange2} required className="w-300px; p-1 border rounded border-gray-200 text-xs" />
                <label className="flex items-center text-xs">
                  <input type="checkbox" checked={sameAsOrderer} onChange={handleSameOrderer} className="mr-1" />
                  주문자 정보와 동일
                </label>
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">휴대폰 번호</td>
              <td className="p-2 border-gray-200 flex space-x-2">
                <input type="text" name="phoneNumber" value={formData2.phoneNumber} onChange={handleChange2} className="w-100px p-1 border rounded border-gray-200 text-xs" />
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">주소</td>
              <td className="p-2 border-gray-200 space-y-2">
                <input type="text" name="postcode" placeholder="" value={formData2.postcode} onChange={handleChange2} required className="w- p-1 border rounded border-gray-200 text-xs" />
                <span>
                  <button type="button" onClick={handleAddressSearch} className="p-1 border rounded border-gray-200 text-xs bg-gray-100 hover:bg-gray-200 mr-2">
                    우편번호 찾기
                  </button>
                </span>
                <input type="text" name="address" placeholder="기본주소" value={formData2.address} onChange={handleChange2} required className="w-full p-1 border rounded border-gray-200 text-xs" />
                <input type="text" name="detailAddress" placeholder="상세주소" value={formData2.detailAddress} onChange={handleChange2} className="w-full p-1 border rounded border-gray-200 text-xs" />
                <input type="text" name="extraAddress" placeholder="추가주소" value={formData2.extraAddress} onChange={handleChange2} className="w-full p-1 border rounded border-gray-200 text-xs" />
              </td>
            </tr>

            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200 text-left">배송 메세지</td>
              <td className="p-2 border-gray-200 flex justify-center items-center">
                <textarea name="message" value={deliveryMessage} onChange={(e) => setDeliveryMessage(e.target.value)} className="w-full p-1 border rounded border-gray-200 text-xs" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      {/* 적립금 */}
      <h2 className="text-lg text-gray-800 font-semibold mb-2 mt-3">할인/적립금</h2>
      <div className="p-2 border border-gray-200 w-210 ml-1 mt-1">
        <div className="mb-2 flex justify-between items-center">
          <label className="text-gray-700">적립금</label>
          <button onClick={handleFullUse} className="bg-gray-700 text-white py-2 rounded-lg font-small text-xs" disabled={!currentUser?.points}>
            <span>전액 사용</span>
          </button>
        </div>
        <div className="flex border rounded p-2 items-centesr">
          <input type="number" value={currentUser?.points || 0} onChange={handlePointChange} className="flex-grow outline-none" placeholder="0" />
          <span className="text-gray-500">원</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">보유 잔액 {currentUser?.points?.toLocaleString() || 0}원</p>
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p className="text-gray-700 text-sm">적립금은 사용제한 없이 언제든 결제가 가능합니다.</p>
        </div>
        <div className="mt-4 border-t pt-2 flex justify-between">
          <span className="text-gray-700">적용금액</span>
          <span className="text-gray-700">{point.toLocaleString()}원</span>
        </div>
      </div>
      {/* 환불방법 */}
      <div className="p-4 w-full max-w-md">
        <h2 className="text-lg  text-gray-800 mb-1 font-semibold mt-5 mr-1">품절시 환불방법</h2>

        <label className="mr-4">
          <input type="radio" value="point" checked={selectedValue === "point"} onChange={handleChange3} />
          적립금
        </label>

        <label className="mr-4">
          <input type="radio" value="change" checked={selectedValue === "change"} onChange={handleChange3} />
          상품변경
        </label>

        <label className="mr-4">
          <input type="radio" value="payment" checked={selectedValue === "payment"} onChange={handleChange3} />
          결제수단 환불
        </label>

        <p className="mt-2 text-sm text-gray-600">
          {selectedValue === "point" ? "추후 환불 시 쿠폰조건이 해지될 경우 할인금액이 차감되어 결제방법으로 환불됩니다." : ""}
          {selectedValue === "change" ? "상품 변경을 선택하시면 주문자 정보를 통해 연락드린 후 교환을 도와드리겠습니다." : ""}
          {selectedValue === "payment" ? "결제수단 환불을 선택하시면 별도의 연락없이 선택하신 결제방법으로 환불해 드립니다." : ""}
        </p>
      </div>
      {/* 결제방법 */}
      <div className="p-3 max-w-xl mx-300px w-500px">
        <h2 className="text-lg  text-gray-800 mb-2 font-semibold mt-4">결제방법 선택</h2>
        <div className="grid grid-cols-4 gap-2 ">
          {paymentMethods.map((method) => (
            <div key={method.id} className={`p-3 flex flex-col items-center cursor-pointer rounded-lg border ${selectedMethod === method.id ? "bg-gray-800 text-white" : "bg-white"}`} onClick={() => setSelectedMethod(method.id)}>
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
                <input type="text" className="w-full p-2 border " placeholder="입금자명" />
                <p className="text-xs text-gray-600"></p>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">입금예정</label>
                <input type="date" className="w-full p-2 border " defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
            </div>
          )}
        </p>
      </div>

      {/* 결제창 */}
      <div className=" ml-1 p-4 bg-white  w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-4">결제정보</h2>
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
            <span>{(getTotalPrice() + SHIPPING_COST - point).toLocaleString("ko-KR")}원</span>
          </div>
        </div>
        <div className="mt-6 flex space-x-2">
          {/* 버튼클릭시 order 데이터베이스 */}
          <Link to={`/orderpage/payment?price=${getTotalPrice() + SHIPPING_COST - point}`} onClick={handleOrderSubmit} className="w-1/2 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 text-center">
            결제하기
          </Link>

          <Link to="/cart" className="w-1/2  text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-900 border-1 text-center">
            취소하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
