import React, { useState } from "react";
import api from "../../services/Api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const EmailValidate = ({ setIsEmailVerified,setEmail }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: "", verificationCode: "" },
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  //이메일 인증번호 요청
  const onEmailSendHandler = async (data) => {
    const { email } = data;

    try {
    
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("email", email);
      await api.post("/auths/public/send-email", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setEmail(email)
      toast.success("이메일 인증번호가 발송되었습니다!");
      setIsCodeSent(true); // 인증번호 입력란 보이도록 설정
    } catch (error) {
      if(error.response && error.response.status === 400){
        toast.error("이미 가입된 이메일입니다.");
        return;
      }else{
        toast.error("이메일 전송 실패! 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };


  const onVerifyCodeHandler = async (data) => {
    try {
        setLoading(true);
        const response = await api.get(`/auths/public/verify-email?email=${watch("email")}&code=${data.verificationCode}`);

        if (response.status === 200) {
            toast.success("이메일 인증 성공!");
            setIsVerified(true);
            setIsEmailVerified(true);
        } else {
            toast.error("잘못된 인증번호입니다.");
        }
    } catch (error) {
        toast.error("인증번호 확인 실패! 다시 시도해주세요.");
    } finally {
        setLoading(false);
    }
};

  

  return (
    <div>
      {/* 이메일 입력 + 인증 요청 버튼 */}
      <div className="flex gap-2">
        <input
          type="email"
          className="w-2/3 pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
          placeholder="이메일"
          {...register("email", {
            required: "이메일을 입력해주세요",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "올바른 이메일 형식을 입력해주세요" },
          })}
          disabled={isCodeSent} // 인증번호가 발송되면 이메일 입력 막기
        />
        <button
          className={`flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm rounded-md hover:bg-gray-300 transition-all duration-300 w-full ${isCodeSent ? "bg-gray-400" : ""}`}
          onClick={handleSubmit(onEmailSendHandler)}
          disabled={isCodeSent}
        >
          <span className="font-semibold text-sm">{isCodeSent ? "인증번호 전송됨" : "인증 요청"}</span>
        </button>
      </div>
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      {/* 인증번호 입력 + 확인 버튼 */}
      {isCodeSent && !isVerified && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="w-2/3 pb-2 border-b border-gray-300 focus:outline-none focus:border-gray-600"
            placeholder="인증번호 입력"
            {...register("verificationCode", {
              required: "인증번호를 입력해주세요",
              minLength: { value: 6, message: "6자리 숫자를 입력해주세요" },
              maxLength: { value: 6, message: "6자리 숫자를 입력해주세요" },
            })}
          />
          <button
            className="flex gap-2 items-center justify-center flex-1 border p-3 shadow-sm rounded-md hover:bg-gray-300 transition-all duration-300 w-full"
            onClick={handleSubmit(onVerifyCodeHandler)}
          >
            인증번호 확인
          </button>
        </div>
      )}
      {errors.verificationCode && <p className="text-red-500 text-sm">{errors.verificationCode.message}</p>}

      {/*  인증 완료 메시지 */}
      {isVerified && (
        <p className="text-green-600 text-sm mt-2">✅ 이메일 인증이 완료되었습니다!</p>
      )}
    </div>
  );
};

export default EmailValidate;
