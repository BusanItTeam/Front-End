import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // API 호출을 위한 axios 인스턴스

function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]); // 문의 리스트 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const inquiriesPerPage = 10; // 페이지당 문의 수

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await api.get("/inquiries"); // 모든 문의 불러오기
        setInquiries(response.data);

        // totalCount를 계산하여 totalPages 설정
        const totalCount = response.data.length || 0; // API에서 직접 length를 사용
        setTotalPages(Math.ceil(totalCount / inquiriesPerPage));
      } catch (error) {
        console.error("문의 목록을 불러오는 데 오류가 발생했습니다.", error);
      }
    };

    fetchInquiries();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * inquiriesPerPage;
  const endIndex = startIndex + inquiriesPerPage;
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="text-center text-2xl font-semibold mb-4">1:1 문의 관리</h2>

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
            <th className="py-2">고객명</th>
            <th className="py-2">분류</th>
            <th className="py-2">문의 제목</th>
            <th className="py-2">작성일자</th>
            <th className="py-2">상태</th>
            <th className="py-2">답변하기</th>
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
              <tr key={inquiry.inquiryId}>
                <td className="py-2">{(currentPage - 1) * inquiriesPerPage + index + 1}</td>
                <td className="py-2">{inquiry.user.username}</td>
                <td className="py-2">{inquiry.title}</td>
                <td className="py-2">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                <td className="py-2">{inquiry.answer ? <span className="text-green-500">답변 완료</span> : <span className="text-red-500">답변 대기 중</span>}</td>
                <td className="py-2">{inquiry.managementNotes || "없음"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4">
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

export default InquiryManagement;
