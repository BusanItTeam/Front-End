import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    defaultValues: { username: "", email: "", phone: "", address: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  const formatPhoneNumber = (value) => {
    value = value.replace(/[^0-9]/g, ""); // 숫자 이외 문자 제거
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  };

  const handlePhoneChange = (event) => {
    const formatted = formatPhoneNumber(event.target.value);
    setValue("phone", formatted);
  };

  const onSubmitHandler = async (data) => {
    const { username, email, phone, address, password } = data;
    const sendData = {
      username,
      email,
      phone,
      address,
      password,
      role: [role],
    };

    try {
      setLoading(true);
      const response = await api.post("/auths/public/signup", sendData);
      toast.success("회원가입 성공! 로그인해주세요.");
      reset();
      if (response.data) {
        navigate("/");
      }
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
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="flex h-screen bg-white mt-30 mb-30">
      {/* 왼쪽 이미지 영역 */}
      <div className="hidden md:flex w-[60%] min-h-[700px] bg-[#cbe4e8] overflow-hidden relative rounded-tr-md rounded-br-md">
        <img
          src="/dl.beatsnoop.png"
          alt="Signup"
          className="absolute w-full h-[90%] object-contain mx-auto"
        />
      </div>

      {/* 중간 실선 */}
      <div className="hidden md:block w-[2px] bg-gray-300"></div>

      {/* 회원가입 폼 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-70 mb-35">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
            Create an Account
          </h2>
          <p className="text-black-500 mb-6">Enter your details below</p>

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
            {/* 유저네임 */}
            <div>
              <input
                type="text"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="아이디"
                {...register("username", { required: "아이디를 입력해주세요" })}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            {/* 이메일 */}
            <div>
              <input
                type="email"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="이메일"
                {...register("email", {
                  required: "이메일을 입력해주세요",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "올바른 이메일 형식을 입력해주세요",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* 주소 */}
            <div>
              <input
                type="text"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="주소"
                {...register("address", { required: "주소를 입력해주세요" })}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            {/* 핸드폰 번호 (자동 하이픈 추가) */}
            <div>
              <input
                type="text"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="010-1234-5678"
                {...register("phone", {
                  required: "핸드폰 번호를 입력해주세요",
                })}
                onChange={handlePhoneChange}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

             {/* 비밀번호 */}
            <div>
              <input
                type="password"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="비밀번호"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                  minLength: { value: 6, message: "비밀번호는 최소 6자 이상 입력해주세요" },
                })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

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
