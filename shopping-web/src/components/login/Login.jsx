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
    <div className="flex h-screen bg-white mt-30 mb-30">
      {/* 왼쪽 이미지 영역 */}
      <div className="hidden md:flex w-[61%] min-h-[700px] bg-[#cbe4e8] overflow-hidden relative rounded-tr-md rounded-br-md">
        <img
          src="/dl.beatsnoop.png"
          alt="Shopping Cart"
          className="absolute w-full h-[90%] object-contain mx-auto"
        />
      </div>

      {/* 중간 실선 */}
      <div className="hidden md:block w-[2px] bg-gray-300"></div>

      {/* 로그인 폼 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-70 mb-35">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6 self-start">
            Log in to Exclusive
          </h2>
          <p className="text-black-500 mb-12 self-start">
            Enter your details below
          </p>

          <form onSubmit={handleSubmit(onLoginHandler)} className="space-y-6">
            {/* 유저네임 */}
            <div>
              <input
                type="text"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="Email or Phone Number"
                {...register("username", { required: "아이디를 입력해주세요" })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <input
                type="password"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="Password"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 로그인 버튼 & 비밀번호 찾기 */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-34 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "Log In"}
              </button>
              <Link to="/" className="text-red-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;