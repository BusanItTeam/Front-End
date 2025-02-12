import "./Login.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/Api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Login = () => {
  // 로그인 페이지
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // 컨텍스트로 토큰 가져옴
  const { setToken, token } = useMyContext();
  const navigate = useNavigate(); //이동객체

  //리액트 훅 폼 사용
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  //로그인 성공시
  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    //컨텍스트에 토큰을 저장
    setToken(token);

    navigate("/"); //홈페이지로 이동
  };

  //로그인 함수
  const onLoginHandler = async (data) => {
    try {
      setLoading(true); //로딩시작
      const response = await api.post("/auth/public/signin", data);

      toast.success("로그인 성공!");
      reset(); //입력창 리셋

      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        console.log(decodedToken); //토큰해석
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      } else {
        toast.error("로그인 실패! 유저네임과 패스워드 확인필요.");
      }
    } catch (error) {
      if (error) {
        toast.error("로그인 실패! 에러발생!");
      }
    } finally {
      setLoading(false);
    }
  };

  //토큰이 있으면 홈페이지로 감(로그인 필요없음)
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="log-in">
      <div className="div">
        <div className="frame-7">
          <div className="side-image">
            <img className="dl-beatsnoop" src="dl.beatsnoop.png" />
          </div>
          <form onSubmit={handleSubmit(onLoginHandler)} className="frame-8">
            <div className="frame-9">
              <div className="frame-10">
                <div className="text-wrapper-6">로그인 페이지</div>
                <div className="text-wrapper-7">
                  아이디와 비밀번호를 입력해주세요
                </div>
              </div>
              <div className="frame-8">
                <div className="frame-11">
                  <InputField
                    className="text-wrapper-8"
                    required
                    id="username"
                    type="text"
                    message="*아이디를 입력해주세요"
                    placeholder="type your username"
                    register={register}
                    errors={errors}
                  />{" "}
                  <div className="under-line"></div>
                </div>
                <div className="frame-11">
                  <InputField
                    className="text-wrapper-8"
                    required
                    id="password"
                    type="password"
                    message="*비밀번호를 입력해주세요"
                    placeholder="type your password"
                    register={register}
                    errors={errors}
                  />
                  <div className="under-line-2"></div>
                </div>
              </div>
            </div>
            <div className="frame-12">
              <div className="frame-13">
                <button type="submit" className="button">
                  <div className="view-all-products">로그인</div>
                </button>
              </div>
              <Link to="/" className="text-wrapper-9">
                비밀번호 찾기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
