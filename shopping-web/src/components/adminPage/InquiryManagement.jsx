import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/Api"; // API 호출을 위한 axios 인스턴스

function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]); // 문의 리스트 상태
  const [user, setUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const inquiriesPerPage = 10; // 페이지당 문의 수

  const [expandedId, setExpandedId] = useState(null); // 펼친 문의 ID
  const [answers, setAnswers] = useState({}); // 답변 상태

  const fetchInquiries = useCallback(async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      const response = await api.get("/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 작성일자(createdAt)를 기준으로 내림차순 정렬
      const sortedInquiries = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setInquiries(sortedInquiries);

      setTotalPages(Math.ceil(sortedInquiries.length / inquiriesPerPage));
      console.log("이거다", response.data);
    } catch (error) {
      console.error("문의 목록을 불러오는 데 오류가 발생했습니다.", error);
    }
  }, [inquiriesPerPage]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleExpand = (inquiryId) => {
    setExpandedId(expandedId === inquiryId ? null : inquiryId);
  };

  const handleAnswerChange = (inquiryId, value) => {
    setAnswers({ ...answers, [inquiryId]: value });
  };

  const submitAnswer = async (inquiryId) => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      await api.post(
        `/inquiries/${inquiryId}/answer`,
        { answer: answers[inquiryId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("답변이 등록되었습니다.");
      setAnswers({ ...answers, [inquiryId]: "" });
      fetchInquiries(); // 답변 후 목록 갱신
    } catch (error) {
      console.error("답변 등록 오류", error);
      alert("답변 등록에 실패했습니다.");
    }
  };

  // 현재 페이지에 해당하는 문의 데이터만 가져오기
  const startIndex = (currentPage - 1) * inquiriesPerPage;
  const endIndex = startIndex + inquiriesPerPage;
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="text-center text-2xl font-semibold mb-4">1:1 문의 관리</h2>
      <table className="w-full border-t text-sm text-center">
        <thead>
          <tr className="border-b">
            <th className="py-2">번호</th>
            <th className="py-2">고객명</th>
            <th className="py-2">분류</th>
            <th className="py-2">제목</th>
            <th className="py-2">작성일자</th>
            <th className="py-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {currentInquiries.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-4 text-gray-500">
                게시물이 없습니다.
              </td>
            </tr>
          ) : (
            currentInquiries.map((inquiry, index) => (
              <React.Fragment key={inquiry.inquiryId}>
                <tr
                  onClick={() => toggleExpand(inquiry.inquiryId)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="py-2">{startIndex + index + 1}</td>
                  <td className="py-2">{inquiry.name || "알 수 없음"}</td>
                  <td className="py-2">{inquiry.type}</td>
                  <td className="py-2">{inquiry.title}</td>
                  <td className="py-2">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {inquiry.answer ? (
                      <span className="text-green-500">답변 완료</span>
                    ) : (
                      <span className="text-red-500">답변 대기 중</span>
                    )}
                  </td>
                </tr>
                {expandedId === inquiry.inquiryId && (
                  <tr>
                    <td colSpan="7" className="p-4 bg-gray-50 text-left">
                      <div className="mt-4 p-3 bg-white">
                        <div className="flex items-start">
                          <strong className="mr-2 mt-1 w-24 flex-shrink-0">
                            문의 내용:
                          </strong>
                          <p className="mt-1 flex-1 text-gray-700">
                            {inquiry.content}
                          </p>
                        </div>
                      </div>
                      {inquiry.answer && (
                        <div className="mt-4 p-3 bg-white">
                          <div className="flex items-start">
                            <strong className="mr-2 mt-1 w-24 flex-shrink-0">
                              답변:
                            </strong>
                            <p className="mt-1 text-gray-700">
                              {inquiry.answer}
                            </p>
                          </div>
                        </div>
                      )}
                      <textarea
                        className="w-full border p-2 mt-2 text-sm"
                        rows="3"
                        placeholder="답변을 입력하세요"
                        value={answers[inquiry.inquiryId] || ""}
                        onChange={(e) =>
                          handleAnswerChange(inquiry.inquiryId, e.target.value)
                        }
                      />
                      <button
                        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
                        onClick={() => submitAnswer(inquiry.inquiryId)}
                      >
                        답변 등록
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-pink-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default InquiryManagement;
