import { useEffect, useState } from "react";
import { useMyContext } from "../../store/ContextApi";
import Api from "../../services/Api";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const { currentUser } = useMyContext();
  console.log("커런트", currentUser);
  const SHIPPING_COST = 3000;
  const backendURL = "http://localhost:8080";

  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [selectedValue, setSelectedValue] = useState("적립금");
  const [selectedMethod, setSelectedMethod] = useState("credit");

  const [point, setPoint] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");

  const [Item, setItem] = useState(null); // 로컬 스토리지에서 가져온 상품 정보를 저장할 상태
  const [selectedItems, setSelectedItems] = useState([]);

  // ✅ 바로 구매 상품 정보 가져오기
  useEffect(() => {
    const storedDirectBuyInfo = localStorage.getItem("directBuyInfo");
    if (storedDirectBuyInfo) {
      const directBuyInfo = JSON.parse(storedDirectBuyInfo);
      setItem(directBuyInfo);
      localStorage.removeItem("directBuyInfo"); // 정보 사용 후 삭제
      console.log("Direct Buy Item Info:", directBuyInfo);
    }
  }, []);

  // ✅ 페이지 마운트 시 장바구니에서 선택된 상품 정보 가져오기
  useEffect(() => {
    const storedItems = localStorage.getItem("selectedItems");
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
      localStorage.removeItem("selectedItems"); // 정보 사용 후 삭제
      console.log("Selected Items:", JSON.parse(storedItems));
    }
  }, []);

  //✅ 유저 정보 가져오기
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phoneNumber: currentUser?.phoneNumber || "",
    postcode: currentUser?.addresses?.[0]?.postcode || "",
    address: currentUser?.addresses?.[0]?.address || "",
    detailAddress: currentUser?.addresses?.[0]?.detailAddress || "",
    extraAddress: currentUser?.addresses?.[0]?.extraAddress || "",
  });

  const [formData2, setFormData2] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    postcode: "",
    address: "",
    detailAddress: "",
    extraAddress: "",
  });

  useEffect(() => {
    if (currentUser) {
      setPoint(currentUser.points || 0); // 포인트 설정

      // UserInfoResponse에서 첫 번째 주소 정보 가져오기
      const userAddress = currentUser?.addresses?.[0] || {};

      // formData 상태 업데이트
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        postcode: userAddress.postcode || "",
        address: userAddress.address || "",
        detailAddress: userAddress.detailAddress || "",
        extraAddress: userAddress.extraAddress || "",
      });
    }
  }, [currentUser]);

  // ✅ 결제하기 버튼 클릭 시 주문저장
  const handleOrderSubmit = async () => {
    // 사용자 정보와 상품 정보가 모두 필요한 경우
    if (!currentUser?.id || (selectedItems.length === 0 && !Item)) {
      alert("유효한 사용자 또는 장바구니 상품이 없습니다.");
      return;
    }

    // 장바구니 상품과 바로 구매 상품에 대해 구분하여 처리
    let orderDetails = [];

    // 장바구니 상품이 있을 경우
    if (selectedItems.length > 0) {
      orderDetails = selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        optionId: item.optionId,
      }));
    }

    // 바로 구매 상품이 있을 경우
    if (Item && Item.product) {
      orderDetails.push({
        productId: Item.productId,
        quantity: Item.quantity,
        optionId: Item.optionId,
      });
    }

    const orderData = {
      userId: currentUser.id,
      totalPrice: getTotalPrice() + SHIPPING_COST - point,
      status: "PENDING",
      shippingCost: SHIPPING_COST,
      paymentMethod: selectedMethod,
      refundMethod: selectedValue,
      shippingAddress: `${formData2.address} ${formData2.detailAddress} ${formData2.extraAddress}`.trim(),
      recipient: formData2.name,
      orderMessage: deliveryMessage,
      orderDetails: orderDetails, // 장바구니 상품 + 바로 구매 상품
    };

    try {
      const token = localStorage.getItem("JWT_TOKEN");
      console.log("🔑 JWT 토큰 확인:", token);

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 예상 적립금 계산
      const estimatedPoints = calculateEstimatedPoints();

      // 포인트 사용 및 적립 API 호출
      const pointResponse = await Api.post(
        "/orders/updatePoints",
        {
          usedPoints: point, // 사용 포인트
          earnedPoints: estimatedPoints, // 적립 포인트
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (pointResponse.status !== 200) {
        throw new Error("포인트 업데이트 실패");
      }

      const response = await Api.post("/orders/create", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("주문이 성공적으로 생성되었습니다:", response.data);

      alert("주문이 완료되었습니다.");
      window.location.href = "/orderpage/ordercomplete";
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

  // ✅ 최대 사용 가능 포인트 계산 함수
  const getMaxUsablePoint = () => {
    const totalPrice = getTotalPrice();
    const userPoints = currentUser?.points || 0;
    return Math.min(totalPrice, userPoints);
  };

  // ✅ 포인트 전액 사용 함수
  const handleFullUse = () => {
    setPoint(getMaxUsablePoint()); // 최대 사용 가능 포인트로 설정
  };

  // ✅ 포인트 입력 값 제한 함수
  const handlePointChange = (event) => {
    let value = Number(event.target.value);
    const maxUsablePoint = getMaxUsablePoint();

    // 최대 사용 가능 포인트 제한
    if (value > maxUsablePoint) {
      value = maxUsablePoint;
    }

    // 음수 값 제한
    if (value < 0) {
      value = 0;
    }

    setPoint(value);
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
        name: "",
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
    let totalPrice = 0;

    // 바로 구매 상품이 있을 경우 가격 계산
    if (Item && Item.product) {
      totalPrice += Item.product.price * Item.quantity;
    }

    // 장바구니 상품이 있을 경우 가격 계산
    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        totalPrice += item.price * item.quantity; // 장바구니 상품의 가격을 사용
      });
    }

    return totalPrice;
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
    let totalPoints = 0;

    // 바로 구매 상품의 예상 적립금 계산
    if (Item && Item.product) {
      totalPoints += Math.floor(Item.product.price * Item.quantity * 0.01);
    }

    // 장바구니 상품의 예상 적립금 계산
    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        totalPoints += Math.floor(item.price * item.quantity * 0.01);
      });
    }

    return totalPoints;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ORDER</h1>

      <div className=" bg-white  p-4">
        <h2 className="text-lg  text-gray-800 mb-3 font-semibold">주문상품</h2>

        <div className="overflow-x-auto">
          {/* 바로 구매 상품 정보 테이블 */}
          {Item && Item.product && (
            <table className="w-full border-t border-gray-200 text-sm text-center">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2">이미지</th>
                  <th className="py-2">상품 정보</th>
                  <th className="py-2">옵션</th>
                  <th className="py-2">가격</th>
                  <th className="py-2">수량</th>
                  <th className="py-2">예상 적립금</th>
                  <th className="py-2">배송 구분</th>
                </tr>
              </thead>
              <tbody>
                {[Item].map((item) => (
                  <tr key={item.product.productId} className="text-center border-b border-gray-200">
                    <td className="py-2">
                      <img src={`${backendURL}${item.product.mainImageUrl}`} alt={item.product.name} className="w-16 h-16 mr-2 inline-block" />
                    </td>
                    <td className="py-2">{item.product.name}</td>
                    <td className="py-2">
                      {item.product.options.map((option) =>
                        option.optionId === item.optionId ? (
                          <span key={option.optionId}>
                            color: {option.color}, size: {option.size}
                          </span>
                        ) : null
                      )}
                    </td>
                    <td className="py-2">{(item.product.price * item.quantity).toLocaleString("ko-KR")}원</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">{calculateEstimatedPoints().toLocaleString("ko-KR")}원</td>
                    <td className="py-2">일반 배송</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="overflow-x-auto">
          {/* 장바구니 상품 정보 테이블 */}
          {selectedItems.length > 0 && (
            <table className="w-full border-t border-gray-200 text-sm text-center">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className=" py-2">이미지</th>
                  <th className=" py-2">상품 정보</th>
                  <th className=" py-2">옵션</th>
                  <th className=" py-2">가격</th>
                  <th className=" py-2">수량</th>
                  <th className=" py-2">예상 적립금</th>
                  <th className=" py-2">배송 구분</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.cartId} className="text-center border-b border-gray-200">
                    <td className=" py-2">
                      <img src={`${backendURL}${item.productImageUrl}`} alt={item.productName} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                    </td>
                    <td className=" py-2">{item.productName}</td>
                    <td className=" py-2">{item.color && item.size ? `color: ${item.color}, size: ${item.size}` : "옵션 없음"}</td>
                    <td className=" py-2">{(item.price * item.quantity).toLocaleString("ko-KR")}원</td>
                    <td className=" py-2">{item.quantity}</td>
                    <td className=" py-2">{((item.price / 100) * item.quantity).toLocaleString("ko-KR")}원</td>
                    <td className=" py-2">일반 배송</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
                <input type="text" name="name" value={currentUser?.name} onChange={handleChange} required className="w-300px; p-1 border rounded border-gray-200 text-xs" />
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">주소</td>
              <td className="p-2 border-gray-200 space-y-2">
                <input type="text" name="postcode" placeholder="" value={formData.postcode} onChange={handleChange} required className="w- p-1 border rounded border-gray-200 text-xs" />
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
        <br />
        <br />

        {/* 배송지 정보 */}

        <h2 className="text-lg  text-gray-800 mb-1 font-semibold">배송지 정보</h2>
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2 border-gray-200">이름</td>
              <td className="p-2 border-gray-200">
                <input type="text" name="name" value={formData2.name} onChange={handleChange2} required className="w-300px; p-1 border rounded border-gray-200 text-xs" />
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
          <button
            onClick={handleFullUse}
            className="bg-gray-700 text-white py-2 rounded-lg font-small text-xs"
            disabled={!currentUser?.points} // 보유 포인트가 없으면 비활성화
          >
            <span>전액 사용</span>
          </button>
        </div>
        <div className="flex border rounded p-2 items-centesr">
          <input
            type="number"
            value={point} // point 상태를 value로 설정
            onChange={handlePointChange}
            className="flex-grow outline-none"
            placeholder="0"
          />
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
          <Link to={`/orderpage/ordercomplete`} onClick={handleOrderSubmit} className="w-1/2 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 text-center">
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
