import React, { useEffect, useState } from "react";
import CustomerFAQ from "./CustomerFAQ";

// 더미 데이터
const dummyInquiries = [
  {
    id: 1,
    customer: "김철수",
    content: "배송이 언제 되나요?",
    status: "대기중",
    answer: "",
  },
  {
    id: 2,
    customer: "이영희",
    content: "환불 절차가 어떻게 되나요?",
    status: "답변완료",
    answer: "환불 절차는...",
  },
  {
    id: 3,
    customer: "박지성",
    content: "품절된 상품 입고 예정이 있나요?",
    status: "대기중",
    answer: "",
  },
  {
    id: 4,
    customer: "최민지",
    content: "사이즈 교환 가능한가요?",
    status: "답변완료",
    answer: "네, 가능합니다...",
  },
  {
    id: 5,
    customer: "정우성",
    content: "쿠폰 사용 방법을 알려주세요.",
    status: "대기중",
    answer: "",
  },
];

const dummyFAQs = [
  {
    id: 1,
    question: "배송은 얼마나 걸리나요?",
    answer: "일반적으로 2-3일 소요됩니다.",
  },
  {
    id: 2,
    question: "반품/교환 정책은 어떻게 되나요?",
    answer: "구매 후 7일 이내에 가능합니다.",
  },
  {
    id: 3,
    question: "회원가입은 어떻게 하나요?",
    answer: "홈페이지 우측 상단의 '회원가입' 버튼을 클릭하세요.",
  },
  {
    id: 4,
    question: "포인트는 어떻게 적립되나요?",
    answer: "구매금액의 1%가 자동 적립됩니다.",
  },
  {
    id: 5,
    question: "해외 배송도 가능한가요?",
    answer: "현재 해외 배송은 지원하지 않습니다.",
  },
];

const dummyReviews = [
  {
    id: 1,
    customer: "홍길동",
    productName: "멋진 신발",
    rating: 5,
    content: "매우 만족합니다!",
    status: "승인",
  },
  {
    id: 2,
    customer: "김미영",
    productName: "편한 의자",
    rating: 4,
    content: "편하지만 조금 비싸요",
    status: "대기중",
  },
  {
    id: 3,
    customer: "이철수",
    productName: "고급 시계",
    rating: 3,
    content: "기대만큼은 아니네요",
    status: "승인",
  },
  {
    id: 4,
    customer: "박영희",
    productName: "스마트폰",
    rating: 5,
    content: "최고의 선택이었어요!",
    status: "대기중",
  },
  {
    id: 5,
    customer: "정민수",
    productName: "노트북",
    rating: 2,
    content: "품질이 좋지 않아요",
    status: "거부",
  },
];

function CustomerSupport() {
  const [inquiries, setInquiries] = useState(dummyInquiries);

  const [reviews, setReviews] = useState(dummyReviews);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answer, setAnswer] = useState("");


  // 문의 답변 함수
  const answerInquiry = () => {
    if (selectedInquiry) {
      setInquiries(
        inquiries.map((i) =>
          i.id === selectedInquiry.id ? { ...i, answer, status: "답변완료" } : i
        )
      );
      setSelectedInquiry(null);
      setAnswer("");
    }
  };

  


  // FAQ 추가 함수
  const addFAQ = (question, answer) => {
    const newFAQ = { id: faqs.length + 1, question, answer };
    setFaqs([...faqs, newFAQ]);
  };

  // 리뷰 관리 함수
  const manageReview = (id, action) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">고객 지원</h2>

      {/* 1:1 문의 관리 UI */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">1:1 문의 관리</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">고객명</th>
              <th className="border p-2">문의 내용</th>
              <th className="border p-2">상태</th>
              <th className="border p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="border p-2">{inquiry.customer}</td>
                <td className="border p-2">{inquiry.content}</td>
                <td className="border p-2">{inquiry.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    답변하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedInquiry && (
          <div className="mt-4">
            <h4 className="font-semibold">답변 작성</h4>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
            <button
              onClick={answerInquiry}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              답변 등록
            </button>
          </div>
        )}
      </div>

        <CustomerFAQ />
      {/* 상품 리뷰 및 평점 관리 UI */}
      <div>
        <h3 className="text-xl font-semibold mb-2">상품 리뷰 및 평점 관리</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">고객명</th>
              <th className="border p-2">상품명</th>
              <th className="border p-2">평점</th>
              <th className="border p-2">리뷰 내용</th>
              <th className="border p-2">상태</th>
              <th className="border p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="border p-2">{review.customer}</td>
                <td className="border p-2">{review.productName}</td>
                <td className="border p-2">{review.rating}</td>
                <td className="border p-2">{review.content}</td>
                <td className="border p-2">{review.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => manageReview(review.id, "승인")}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => manageReview(review.id, "거부")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    거부
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerSupport;
