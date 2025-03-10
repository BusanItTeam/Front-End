import React, { useEffect, useState } from "react";
import api from "../../services/Api";

const CustomerFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // FAQ 불러오기
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/public/FAQ");
        setFaqs(response.data);
      } catch (error) {
        console.error("FAQ 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  //  새로운 FAQ 추가
  const handleAddFaq = async () => {
    if (!newQuestion || !newAnswer) {
      alert("질문과 답변을 입력하세요.");
      return;
    }

    try {
      const response = await api.post("/public/FAQ", {
        question: newQuestion,
        answer: newAnswer,
      });

      setFaqs((prevFaqs) => [...prevFaqs, response.data]); 
      setNewQuestion("");
      setNewAnswer("");
    } catch (error) {
      console.error("FAQ 추가 실패:", error);
    }
  };

  // FAQ 삭제 (삭제 후 즉시 반영)
  const handleDeleteFaq = async (id) => {
    try {
      await api.delete(`/public/FAQ/${id}`);
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.faqId !== id)); 
    } catch (error) {
      console.error("FAQ 삭제 실패:", error);
    }
  };

  // AQ 수정 버튼 클릭 시 (수정 모드 활성화)
  const handleEditClick = (faq) => {
    setEditMode(faq.faqId);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  //  FAQ 수정 저장 (수정된 내용 업데이트)
  const handleSaveEdit = async (id) => {
    try {
      const response = await api.put(`/public/FAQ/${id}`, {
        question: editQuestion,
        answer: editAnswer,
      });

      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) => (faq.faqId === id ? response.data : faq))
      );

      setEditMode(null); // 수정 모드 종료
    } catch (error) {
      console.error("FAQ 수정 실패:", error);
    }
  };

  if (loading) return <p>Loading FAQs...</p>;

  return (
    <>
      {/* FAQ 질문 리스트 */}
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">자주 묻는 질문</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.faqId} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
              {editMode === faq.faqId ? (
                // 수정 모드 UI
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    className="border p-2 mb-2"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                  />
                  <textarea
                    className="border p-2 mb-2"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(faq.faqId)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                //  일반 모드 UI
                <>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {faq.faqId}. {faq.question}
                    </h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(faq)}
                      className="flex gap-2 items-center justify-center border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-blue-500 transition-all duration-300"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.faqId)}
                      className="flex gap-2 items-center justify-center border p-3 shadow-sm shadow-gray-200 rounded-md hover:bg-red-500 transition-all duration-300"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 새 질문 추가 입력 폼 */}
      <div className="mb-4 p-4 border rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="질문을 입력하세요"
          className="w-full border p-2 mb-2"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <textarea
          placeholder="답변을 입력하세요"
          className="w-full border p-2 mb-2"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button
          onClick={handleAddFaq}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          질문 추가하기
        </button>
      </div>
    </>
  );
};

export default CustomerFAQ;
