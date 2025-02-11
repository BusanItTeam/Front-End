import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 백엔드로 전송
    console.log("Signing up with:", { name, emailOrPhone, password });
    // 가입성공후 로그인페이지로
    navigate("/login");
  };

  const handleGoogleSignUp = () => {
    // 구글회원가입 로직 여기
    console.log("Signing up with Google");
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

            <form onSubmit={handleSubmit} className="frame-10">
              <div className="frame-11">
                <div className="frame-12">
                  <label className="text-wrapper-9">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="under-line-2"></div>
                </div>
                <div className="frame-12">
                  <label className="text-wrapper-9">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email or phone"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                  />
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
