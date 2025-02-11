import React from "react";
import "./SignUp.css";

const SignUp = () => {
  return (
    <div className="sign-up">
      {/* 상단 헤더 */}
      <div className="div">
        <div className="line"></div>
        <div className="frame-7">
          {/* 왼쪽 이미지 */}
          <div className="side-image">
            <img
              className="dl-beatsnoop"
              src="/dl.beatsnoop1.png"
              alt="Shopping Cart"
            />
          </div>

          {/* 오른쪽 회원가입 폼 */}
          <div className="frame-8">
            <div className="frame-9">
              <h2 className="text-wrapper-7">Create an account</h2>
              <p className="text-wrapper-8">Enter your details below</p>
            </div>

            {/* 입력 필드 */}
            <div className="frame-10">
              <div className="frame-11">
                <div className="frame-12">
                  <label className="text-wrapper-9">Name</label>
                  <input type="text" placeholder="Enter your name" />
                  <div className="under-line-2"></div>
                </div>
                <div className="frame-12">
                  <label className="text-wrapper-9">
                    Email or Phone Number
                  </label>
                  <input type="text" placeholder="Enter your email or phone" />
                  <div className="under-line-3"></div>
                </div>
                <div className="frame-12">
                  <label className="text-wrapper-9">Password</label>
                  <input type="password" placeholder="Enter your password" />
                  <div className="under-line-4"></div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="frame-13">
                <button className="button">Create Account</button>

                {/* Google 회원가입 */}
                <div className="frame-14">
                  <button className="google-sign-up">
                    <img
                      src="/img/icon-google.svg"
                      alt="Google Icon"
                      className="img"
                    />
                    Sign up with Google
                  </button>

                  {/* 이미 계정이 있는 경우 */}
                  <div className="frame-16">
                    <p>Already have an account?</p>
                    <a href="/login" className="text-wrapper-12">
                      Log in
                    </a>
                    <div className="under-line-5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
