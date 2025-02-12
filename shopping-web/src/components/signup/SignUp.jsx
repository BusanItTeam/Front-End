import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (username.length < 2 || username.length > 20) {
      newErrors.username = "유저네임은 2~20글자로 입력해주세요";
      isValid = false;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "이메일 형식에 맞게 써주세요";
      isValid = false;
    } else if (email.length > 50) {
      newErrors.email = "이메일은 최대50글자입니다";
      isValid = false;
    }

    if (password.length < 6 || password.length > 40) {
      newErrors.password = "비밀번호는 6~40글자로 입력해주세요";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auths/public/signup",
        {
          username,
          email,
          password,
          role: ["user"],
        }
      );

      console.log("Sign up successful:", response.data);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors({ ...errors, server: err.response.data.message });
      } else {
        setErrors({ ...errors, server: "An error occurred during sign up" });
      }
      console.error("Sign up error:", err);
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
              <p className="text-secondary-2 mb-6 text-lg">{errors.server}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-12">
                <div className="space-y-3">
                  <label className="block text-lg text-text-2 opacity-40">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full border-b border-gray-300 pb-3 text-lg focus:outline-none focus:border-text-2"
                  />
                  {errors.username && (
                    <p className="text-secondary-2 text-base mt-2">
                      {errors.username}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-b border-gray-300 pb-3 text-lg focus:outline-none focus:border-text-2"
                  />
                  {errors.email && (
                    <p className="text-secondary-2 text-base mt-2">
                      {errors.email}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-b border-gray-300 pb-3 text-lg focus:outline-none focus:border-text-2"
                  />
                  {errors.password && (
                    <p className="text-secondary-2 text-base mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-text py-5 rounded-md text-xl hover:bg-hover-button transition duration-300"
                >
                  Create Account
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
