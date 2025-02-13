import React, { useState } from "react";
import { Link } from "react-router-dom";

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "상품문의",
    uccUrl: "",
    password: "",
    privacy: "공개",
    captcha: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="text-center text-2xl font-semibold mb-4">Q/A</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">제목</label>
        <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
          <option value="상품문의">상품문의</option>
          <option value="배송문의">배송문의</option>
          <option value="배송문의">반품 및 교환문의</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <div className="mb-4">
        <textarea className="w-full p-3 border rounded h-40" placeholder="내용을 입력하세요"></textarea>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">첨부파일{i + 1}</label>
          <input type="file" className="w-full p-2 border rounded" />
        </div>
      ))}

      <div className="flex justify-end space-x-2">
        <Link to="/myPage/boardList">
          <button className="px-4 py-2 bg-gray-400 text-white rounded">취소</button>
        </Link>
        <button className="px-4 py-2 bg-gray-400 text-white rounded">등록</button>
      </div>
    </div>
  );
};

export default InquiryForm;
