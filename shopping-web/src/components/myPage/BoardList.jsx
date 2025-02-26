import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"; // API 호출을 위한 axios 인스턴스
import { useMyContext } from "../../store/ContextApi"; // 사용자 상태를 가져오기 위한 Context

function BoardList() {
  const { currentUser, setCurrentUser } = useMyContext(); // 로그인된 유저 정보
  const [inquiries, setInquiries] = useState([]); // 유저의 문의 리스트 상태

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const inquiriesPerPage = 10; // 페이지당 문의 수
  const navigate = useNavigate();

  const [expandedId, setExpandedId] = useState(null);
  const [expandedInquiries, setExpandedInquiries] = useState({}); // ✅ 변경: 여러 개 관리

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

        console.log("API 응답:", response.data);

        // 최신순 정렬 후 상태 업데이트
        const sortedInquiries = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInquiries(sortedInquiries);

        // totalCount를 계산하여 totalPages 설정
        const totalCount = response.data.length || 0;
        setTotalPages(Math.ceil(totalCount / inquiriesPerPage));
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedInquiries({}); // ✅ 페이지 변경 시 전체 초기화
  };

  // ✅ 펼침 상태를 개별적으로 관리하는 함수
  const toggleExpand = (inquiryId) => {
    setExpandedId((prevId) => (prevId === inquiryId ? null : inquiryId));
  };

  const startIndex = (currentPage - 1) * inquiriesPerPage;
  const endIndex = startIndex + inquiriesPerPage;
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  console.log("Total Pages:", totalPages);
  console.log("Current Page:", currentPage);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="pb-7 text-center text-2xl font-semibold mb-4">MY BOARD</h2>

      <table className="w-full border-t text-sm text-center">
        <thead>
          <tr className="border-b">
            <th className="py-2">번호</th>
            <th className="py-2">분류</th>
            <th className="py-2">제목</th>
            <th className="py-2">작성일</th>
            <th className="py-2">답변</th>
          </tr>
        </thead>
        <tbody>
          {currentInquiries.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 text-gray-500">
                게시물이 없습니다.
              </td>
            </tr>
          ) : (
            currentInquiries.map((inquiry, index) => (
              <React.Fragment key={`inquiry-${inquiry.inquiryId}`}>
                <tr onClick={() => toggleExpand(inquiry.inquiryId)} className="cursor-pointer hover:bg-gray-100">
                  <td className="py-2">{(currentPage - 1) * inquiriesPerPage + index + 1}</td>
                  <td className="py-2">{inquiry.type}</td>
                  <td className="py-2">{inquiry.title}</td>
                  <td className="py-2">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{inquiry.answer ? <span className="text-green-500">답변 완료</span> : <span className="text-red-500">답변 대기 중</span>}</td>
                </tr>
                {expandedId === inquiry.inquiryId && (
                  <tr key={`inquiry-content-${inquiry.inquiryId}`}>
                    <td colSpan="7" className="p-4 bg-gray-50 text-left">
                      <div className="mt-4 p-3 bg-white">
                        <div className="flex items-start">
                          <strong className="mr-2 mt-1 w-24 flex-shrink-0">문의 내용:</strong>
                          <p className="mt-1 flex-1 text-gray-700">{inquiry.content}</p>
                        </div>
                      </div>
                      {inquiry.answer && (
                        <div className="mt-4 p-3 bg-white">
                          <div className="flex items-start">
                            <strong className="mr-2 mt-1 w-24 flex-shrink-0">답변:</strong>
                            <p className="mt-1 text-gray-700">{inquiry.answer}</p>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      <div className="pt-2 pb-2 flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-pink-500 text-white" : "bg-gray-200"}`} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

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
