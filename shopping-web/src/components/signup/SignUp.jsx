import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
const SignUp = () => {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const { token } = useMyContext();
  const navigate = useNavigate();





  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({       
    defaultValues: { username: "", email: "", phoneNumber: "", postcode: "", address: "", detailAddress: "", extraAddress: "",  password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  // 핸드폰 번호 포맷 변경
  const formatPhoneNumber = (value) => {
    value = value.replace(/[^0-9]/g, "");
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  };

  const handlePhoneChange = (event) => {
    const formatted = formatPhoneNumber(event.target.value);
    setValue("phoneNumber", formatted);

  };



  

  const onSubmitHandler = async (data) => {
    console.log("회원가입 요청 데이터:", data); // 로그 확인
  
    const { username, email, phoneNumber, postcode, address, detailAddress, extraAddress, password } = data;
    const sendData = { 
      username, 
      email, 
      phoneNumber, 
      postcode, 
      address, 
      detailAddress: detailAddress || "",  // null 방지
      extraAddress: extraAddress || "", 
      password, 
      role: [role] 
    };

    try {
      setLoading(true);
      const response = await api.post("/auths/public/signup", sendData);
      toast.success("회원가입 성공! 로그인해주세요.");
      reset();
      if (response.data) navigate("/");
    } catch (error) {
      if (error?.response?.data?.message === "Error: Username is already taken!") {
        setError("username", { message: "이미 사용 중인 아이디입니다." });
      } else if (error?.response?.data?.message === "Error: Email is already in use!") {
        setError("email", { message: "이미 가입된 이메일입니다." });
      } else {
        toast.error("회원가입 실패! 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/login");
  }, [navigate, token]);

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
    <div className="flex h-screen bg-white mt-30 mb-30">
      {/* 왼쪽 이미지 영역 */}
      <div className="hidden sm:flex md:w-[60%] min-h-[700px] bg-[#cbe4e8] overflow-hidden relative rounded-tr-md rounded-br-md">
        <img
          src="/dl.beatsnoop.png"
          alt="Signup"
          className="absolute w-full h-[90%] object-contain mx-auto"
        />
      </div>

      {/* 회원가입 폼 */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center items-center px-6 sm:px-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">Create an Account</h2>
          <p className="text-gray-500 mb-6">Enter your details below</p>

          {/* 소셜 로그인 버튼 */}
          <div className="flex items-center justify-between gap-2 py-3">
            <a
              href={`${apiUrl}/oauth2/authorization/google`}
              className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300"
            >
              <FcGoogle className="text-2xl" />
              <span className="font-semibold text-sm">Google로 로그인</span>
            </a>
            <a
              href={`${apiUrl}/oauth2/authorization/github`}
              className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300"
            >
              <FaGithub className="text-2xl" />
              <span className="font-semibold text-sm">GitHub로 로그인</span>
            </a>
          </div>

          <div className="w-full border-t border-gray-300 my-4"></div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            {/* 아이디 */}
            <input
              type="text"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
              placeholder="아이디"
              {...register("username", { required: "아이디를 입력해주세요" })}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

            {/* 이메일 */}
            <input
              type="email"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
              placeholder="이메일"
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "올바른 이메일 형식을 입력해주세요" },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* 우편번호 + 우편번호 찾기 버튼 */}
          <div className="flex gap-2">
              <input type="text" className="w-2/3 p-2 border rounded-md" placeholder="우편번호" {...register("postcode")} readOnly />
              <button
            type="button"
            onClick={handleAddressSearch}
            className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300 w-full"
          >
            <span className="font-semibold text-sm">우편번호 찾기</span>
          </button>
            </div>

            {/* 주소 */}
            <input type="text" className="w-full p-2 border rounded-md" placeholder="주소" {...register("address")} readOnly />

            {/* 상세 주소 + 참고 항목 */}
            <div className="flex gap-2">
            <input
              type="text"
              className="w-2/4 p-2 border rounded-md"
              placeholder="상세주소"
              {...register("detailAddress", {
                required: "상세 주소를 입력해주세요",
                onChange: (e) => setValue("detailAddress", e.target.value),
              })}
            />
              <input type="text" className="w-2/4 p-2 border rounded-md" placeholder="추가 주소" {...register("extraAddress")}  />
            </div>
        
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

            {/* 핸드폰 번호 */}
            <input
              type="text"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
              placeholder="010-1234-5678"
              {...register("phoneNumber", { required: "핸드폰 번호를 입력해주세요" })}
              onChange={handlePhoneChange}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}


            {/* 비밀번호 */}
            <input
              type="password"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
              placeholder="비밀번호"
              {...register("password", { required: "비밀번호를 입력해주세요", minLength: { value: 6, message: "6자 이상 입력" } })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                 {/* 비밀번호 확인 */}
            <div>
              <input
                type="password"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="비밀번호 확인"
                {...register("confirmPassword", {
                  required: "비밀번호를 다시 입력해주세요",
                  validate: (value) => value === watch("password") || "비밀번호가 일치하지 않습니다.",
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* 회원가입 버튼 */}
            <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition duration-200" disabled={loading}>
              {loading ? "가입 중..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
