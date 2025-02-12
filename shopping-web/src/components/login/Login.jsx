import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/Api";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));
    setToken(token);
    navigate("/");
  };

  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auths/public/signin", data);
      toast.success("로그인 성공!");
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        const decodedToken = jwtDecode(response.data.jwtToken);
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      } else {
        toast.error("로그인 실패! 유저네임과 패스워드를 확인해주세요.");
      }
    } catch (error) {
      toast.error("로그인 실패! 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      {/* 전체 컨테이너 */}
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl h-[600px]">
        
        {/* Left Side Image (데스크톱에서만 보이게) */}
        <div className="hidden md:flex w-1/2 bg-blue-100">
          <img src="/dl.beatsnoop.png" alt="Shopping Cart" className="w-full h-full object-cover" />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">로그인 페이지</h2>
          <p className="text-gray-600 mt-2">아이디와 비밀번호를 입력해주세요</p>

          <form onSubmit={handleSubmit(onLoginHandler)} className="mt-4 space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-gray-700">아이디</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="아이디를 입력해주세요"
                {...register("username", { required: "아이디를 입력해주세요" })}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700">비밀번호</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="비밀번호를 입력해주세요"
                {...register("password", { required: "비밀번호를 입력해주세요" })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            {/* 비밀번호 찾기 */}
            <div className="text-center mt-4">
              <Link to="/" className="text-blue-500 hover:underline">비밀번호 찾기</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
