import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "상품문의", // Changed from category to type to match backend
    content: "", // Added content field
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the backend API
      const response = await api.post("/inquiries", formData);

      if (response.status === 200) {
        toast.success("문의글이 성공적으로 등록되었습니다!");
        navigate("/myPage/boardList"); // Redirect to the list page
      } else {
        toast.error("문의글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("문의글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-9">
      <h2 className="text-center text-2xl font-semibold mb-4">Q/A</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="제목을 입력하세요" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">문의 유형</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
            <option value="상품문의">상품문의</option>
            <option value="배송문의">배송문의</option>
            <option value="반품 및 교환문의">반품 및 교환문의</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">내용</label>
          <textarea name="content" value={formData.content} onChange={handleChange} className="w-full p-3 border rounded h-40" placeholder="내용을 입력하세요" required></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <Link to="/myPage/boardList">
            <button className="px-4 py-2 bg-gray-400 text-white rounded">취소</button>
          </Link>
          <button type="submit" className="px-4 py-2 bg-gray-400 text-white rounded">
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
