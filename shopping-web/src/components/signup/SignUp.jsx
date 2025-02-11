import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        setError(err.response.data.message);
      } else {
        setError("An error occurred during sign up");
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

            {error && <p className="error-message">{error}</p>}

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
