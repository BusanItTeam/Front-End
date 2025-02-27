import React, { useEffect } from "react";

const AddressInput = ({ register, setValue, watch }) => {
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
            extraAddr += (extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName);
          }
          if (extraAddr !== "") {
            extraAddr = `(${extraAddr})`;
          }
        }

        setValue("postcode", data.zonecode); // 우편번호
        setValue("address", addr); // 주소
        setValue("extraAddress", extraAddr); // 참고 항목
        setValue("detailAddress", ""); // 상세 주소 초기화
      },
    }).open();
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          className="w-2/3 p-2 border rounded-md"
          placeholder="우편번호"
          {...register("postcode", { required: "우편번호를 입력해주세요" })}
          readOnly
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300 w-full"
        >
          <span className="font-semibold text-sm">우편번호 찾기</span>
        </button>
      </div>

      <input type="text" className="w-full p-2 border rounded-md mt-2" placeholder="주소" {...register("address")} readOnly />

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="w-2/4 p-2 border rounded-md"
          placeholder="상세주소"
          {...register("detailAddress", { required: "상세 주소를 입력해주세요" })}
        />
        <input type="text" className="w-2/4 p-2 border rounded-md" placeholder="추가 주소" {...register("extraAddress")} />
      </div>
    </div>
  );
};

export default AddressInput;
