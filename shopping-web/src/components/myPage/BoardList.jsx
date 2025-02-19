import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // API 호출을 위한 axios 인스턴스
import { useMyContext } from "../../store/ContextApi"; // 사용자 상태를 가져오기 위한 Context

function BoardList() {
  const { currentUser, setCurrentUser } = useMyContext(); // 로그인된 유저 정보
  const [inquiries, setInquiries] = useState([]); // 유저의 문의 리스트 상태

  useEffect(() => {
    // currentUser가 null일 경우에만 localStorage에서 불러오기

    if (!currentUser) {
      const storedUser = localStorage.getItem("USER");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser)); // localStorage에서 값 불러오기
      }
    }
  }, [currentUser, setCurrentUser]); // currentUser가 바뀔 때마다 실행

  useEffect(() => {
    console.log("🟢 currentUser 변경됨:", currentUser);
  }, [currentUser]);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!currentUser) {
        console.warn("⚠️ currentUser가 없습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
        return;
      }

      try {
        console.log("🔍 저장된 JWT 토큰:", localStorage.getItem("JWT_TOKEN"));

        const response = await api.get(`/inquiries/user/${currentUser.id}`, {
          withCredentials: true, // 인증 쿠키 전송 여부
        });

        console.log("✅ 요청 헤더 확인:", response.config.headers);
        setInquiries(response.data);
      } catch (error) {
        console.error("문의 목록을 불러오는 데 오류가 발생했습니다.", error);
        if (error.response) {
          console.error("서버 응답 오류 코드:", error.response.status);
          console.error("서버 응답 메시지:", error.response.data);
        }
      }
    };

    fetchInquiries();
  }, [currentUser]); // currentUser가 변경될 때마다 문의 목록을 가져옵니다.

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="text-center text-2xl font-semibold mb-4">MY BOARD</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <label className="text-sm text-gray-600">분류 선택</label>
          <select className="border p-1 text-sm">
            <option>작성 일자별</option>
            <option>분류별</option>
          </select>
        </div>
      </div>

      <table className="w-full border-t text-sm text-center">
        <thead>
          <tr className="border-b">
            <th className="py-2">번호</th>
            <th className="py-2">분류</th>
            <th className="py-2">제목</th>
            <th className="py-2">작성자</th>
            <th className="py-2">작성일</th>
            <th className="py-2">답변</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 text-gray-500">
                게시물이 없습니다.
              </td>
            </tr>
          ) : (
            inquiries.map((inquiry, index) => (
              <tr key={inquiry.id}>
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{inquiry.type}</td>
                <td className="py-2">{inquiry.title}</td>
                <td className="py-2">{inquiry.user.username}</td>
                <td className="py-2">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                <td className="py-2">{inquiry.answer ? <span className="text-green-500">답변 완료</span> : <span className="text-red-500">답변 대기 중</span>}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center">
        <div className="flex-grow flex justify-center space-x-2">
          <select className="border p-1 text-sm">
            <option>제목</option>
            <option>내용</option>
            <option>작성자</option>
          </select>
          <input type="text" className="border p-1 text-sm w-48" placeholder="검색어 입력" />
          <button className="bg-gray-400 text-white px-4 py-1 text-sm rounded">찾기</button>
        </div>
        <div>
          <Link to="/myPage/inquiryForm">
            <button className="bg-gray-400 text-white px-4 py-1 text-sm rounded">글쓰기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BoardList;
