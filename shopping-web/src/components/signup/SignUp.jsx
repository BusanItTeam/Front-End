import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import { useMyContext } from "../../store/ContextApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SignUp = () => {
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
    if (token) navigate("/");
  }, [navigate, token]);

  const onSubmitHandler = async (data) => {
    const { username, email, password } = data;
    const sendData = { username, email, password, role: ["ROLE_USER"] };

    try {
      setLoading(true);
      const response = await api.post("/auths/public/signup", sendData);
      toast.success("회원가입 성공");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (
        error?.response?.data?.message === "Error: 유저네임이 이미 존재합니다."
      ) {
        setError("username", {
          type: "manual",
          message: "유저네임이 이미 존재합니다.",
        });
      } else if (
        error?.response?.data?.message === "Error: 이메일이 이미 사용중 입니다."
      ) {
        setError("email", {
          type: "manual",
          message: "이메일이 이미 사용 중입니다.",
        });
      } else {
        setError("server", {
          type: "manual",
          message: "회원가입 중 오류가 발생했습니다.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Signing up with Google");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-bg">
      <div className="w-full max-w-7xl">
        <div className="border-b border-gray-200"></div>
        <div className="flex">
          <div className="w-1/2 bg-[#cbe4e8] rounded-r-lg overflow-hidden">
            <img
              className="w-full h-auto"
              src="/dl.beatsnoop1.png"
              alt="Shopping Cart"
            />
          </div>

          <div className="w-1/2 p-12">
            <div className="mb-16">
              <h2 className="text-4xl font-medium text-text-2 mb-8">
                Create an account
              </h2>
              <p className="text-xl text-text-2">Enter your details below</p>
            </div>

            {errors.server && (
              <p className="text-secondary-2 mb-6 text-lg">
                {errors.server.message}
              </p>
            )}

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="space-y-12"
            >
              <div className="space-y-12">
                <div className="space-y-3">
                  <label className="block text-lg text-text-2 opacity-40">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    {...register("username", {
                      required: "유저네임을 입력해주세요",
                    })}
                    className="w-full border-b border-gray-300 pb-3 text-lg focus:outline-none focus:border-text-2"
                  />
                  {errors.username && (
                    <p className="text-secondary-2 text-base mt-2">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="block text-lg text-text-2 opacity-40">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "이메일을 입력해주세요",
                    })}
                    className="w-full border-b border-gray-300 pb-3 text-lg focus:outline-none focus:border-text-2"
                  />
                  {errors.email && (
                    <p className="text-secondary-2 text-base mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="block text-lg text-text-2 opacity-40">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요",
                      minLength: {
                        value: 6,
                        message: "비밀번호는 최소 6자 이상이어야 합니다.",
                      },
                    })}
                    className="w-full border-b border-gray-300 pb-3 text-lg focus:outline-none focus:border-text-2"
                  />
                  {errors.password && (
                    <p className="text-secondary-2 text-base mt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-text py-5 rounded-md text-xl hover:bg-hover-button transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full border border-gray-300 py-5 rounded-md flex items-center justify-center space-x-3 text-xl hover:bg-gray-50 transition duration-300"
                >
                  <img
                    src="/Icon-Google.png"
                    alt="Google Icon"
                    className="w-6 h-6"
                  />
                  <span>Sign up with Google</span>
                </button>

                <div className="text-center text-lg">
                  <p className="inline-block">Already have an account?</p>
                  <a
                    href="/login"
                    className="text-text-2 font-medium ml-2 hover:underline"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
