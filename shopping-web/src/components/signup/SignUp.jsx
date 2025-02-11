import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

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
    // Google 회원가입 로직 구현
  };

  return (
    <div className="sign-up">
      <div className="div">
        <div className="line"></div>
        <div className="frame-7">
          <div className="side-image">
            <img
              className="dl-beatsnoop"
              src="/dl.beatsnoop1.png"
              alt="Shopping Cart"
            />
          </div>

          <div className="frame-8">
            <div className="frame-9">
              <h2 className="text-wrapper-7">Create an account</h2>
              <p className="text-wrapper-8">Enter your details below</p>
            </div>

            {errors.server && <p className="error-message">{errors.server}</p>}

            <form onSubmit={handleSubmit} className="frame-10">
              <div className="frame-11">
                <div className="frame-12">
                  <label className="text-wrapper-9">Username</label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {errors.username && (
                    <p className="error-message">{errors.username}</p>
                  )}
                  <div className="under-line-2"></div>
                </div>
                <div className="frame-12">
                  <label className="text-wrapper-9">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                  <div className="under-line-3"></div>
                </div>
                <div className="frame-12">
                  <label className="text-wrapper-9">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )}
                  <div className="under-line-4"></div>
                </div>
              </div>

              <div className="frame-13">
                <button type="submit" className="button">
                  Create Account
                </button>

                <div className="frame-14">
                  <button
                    type="button"
                    className="google-sign-up"
                    onClick={handleGoogleSignUp}
                  >
                    <img
                      src="/Icon-Google.png"
                      alt="Google Icon"
                      className="img"
                    />
                    Sign up with Google
                  </button>

                  <div className="frame-16">
                    <p>Already have an account?</p>
                    <a href="/login" className="text-wrapper-12">
                      Log in
                    </a>
                    <div className="under-line-5"></div>
                  </div>
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
