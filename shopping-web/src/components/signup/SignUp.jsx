import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api"; 
import { useMyContext } from "../../store/ContextApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", email: "", password: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  const onSubmitHandler = async (data) => {
    const { username, email, password } = data;
    const sendData = { username, email, password, role: [role] };

    try {
      setLoading(true);
      const response = await api.post("/auths/public/signup", sendData);
      toast.success("회원가입 성공");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (error?.response?.data?.message === "Error: 유저네임이 이미 존재합니다.") {
        setError("username", { type: "manual", message: "유저네임이 이미 존재합니다." });
      } else if (error?.response?.data?.message === "Error: 이메일이 이미 사용중 입니다.") {
        setError("email", { type: "manual", message: "이메일이 이미 사용 중입니다." });
      } else {
        setError("server", { type: "manual", message: "회원가입 중 오류가 발생했습니다." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        
        {/* Left Side Image */}
        <div className="hidden md:block w-1/2 bg-blue-100">
          <img src="/dl.beatsnoop1.png" alt="Shopping Cart" className="w-full h-full object-cover" />
        </div>

        {/* Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-800">Create an account</h2>
          <p className="text-gray-600 mt-2">Enter your details below</p>

          {errors.server && <p className="text-red-500 text-sm mt-2">{errors.server.message}</p>}

          <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-4 space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
                {...register("username", { required: "유저네임을 입력해주세요" })}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                {...register("email", { required: "이메일을 입력해주세요" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                {...register("password", { 
                  required: "비밀번호를 입력해주세요",
                  minLength: { value: 6, message: "비밀번호는 최소 6자 이상이어야 합니다." }
                })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? "Loading..." : "Create Account"}
            </button>

            {/* Google Signup Button */}
            <button
              type="button"
              className="w-full py-2 px-4 flex items-center justify-center border rounded-md text-gray-700 hover:bg-gray-100 transition"
              onClick={() => console.log("Signing up with Google")}
            >
              <img src="/Icon-Google.png" alt="Google Icon" className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>

            {/* Already have an account */}
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">Log in</a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
