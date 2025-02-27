import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/Api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../InputField/InputField";
import toast from "react-hot-toast";
import Buttons from "../utils/Button";


const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams(); //쿼리 스트링(?~)

  const handleResetPassword = async (data) => {
    const { password, passwordConfirm  } = data;
    if (password !== passwordConfirm) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return; // 요청 중단
    }

    const token = searchParams.get("token");
    setLoading(true);
    try {
      const formData = new URLSearchParams();

      formData.append("token", token);
      formData.append("newPassword", password);
      await api.post("/auths/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", //'application/x-www-urlencoded'는 html form을 통한 POST 전송 방식 중 가장 기본이 되는 content-type
        },
      });
      toast.success("패스워드 리셋 성공! 다시 로그인 해주세요");
      reset();
    } catch (error) {
      toast.error("에러: 패스워드 리셋중");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center font-bold text-2xl">
            비밀번호를 재설정 해주세요
          </h1>
          <p className="text-slate-600 text-center mt-2">
            새로운 비밀번호를 입력해주세요
          </p>
        </div>
        <Divider className="font-semibold pb-4"></Divider>

        <div className="flex flex-col gap-2 mt-4">
          <InputField
            label="비밀번호"
            required
            id="password"
            type="password"
            message="*비밀번호가 필요합니다"
            placeholder="새로운 비밀번호를 입력해주세요..."
            register={register}
            errors={errors}
            min={6}
          />{""}
        </div>

        <div className="flex flex-col gap-2 mt-4">
        <InputField
            label="비밀번호 확인"
            required
            id="passwordConfirm"
            type="password"
            message="*비밀번호를 다시 입력해주세요"
            placeholder="비밀번호를 한 번 더 입력해주세요..."
            register={register}
            errors={errors}
            />

        </div>
        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-customRed font-semibold text-gray w-full py-2 border p-3 shadow-sm mt-6 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
          type="text"
        >
          {loading ? <span>로딩중...</span> : "전송"}
        </Buttons>
        <p className=" text-sm text-slate-700 ">
          <Link className=" underline hover:text-black" to="/login">
            로그인화면으로 가기
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
