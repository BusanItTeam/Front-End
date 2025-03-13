import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import toast from "react-hot-toast";
import { formatCurrency } from "../order/OrderHistory"; // OrderHistory에서 가져온 함수 사용

const ReviewForm = () => {
  const { productId } = useParams();
  const { token, backendURL } = useMyContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productInfo, setProductInfo] = useState(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProductInfo(response.data);
      } catch (error) {
        toast.error("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewDTO = {
      productId: Number(productId),
      rating,
      content,
    };

    const formData = new FormData();
    formData.append(
      "reviewDTO",
      new Blob([JSON.stringify(reviewDTO)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("images", file));

    try {
      await api.post("/review", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("리뷰 작성 성공!");
      navigate(`/product/${productId}`);
    } catch (error) {
      toast.error("리뷰 작성 실패");
    }
  };

  if (loading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">리뷰 작성</h2>

      {/* 상품 정보 표시 */}

      <form onSubmit={handleSubmit}>
        {/* 별점 선택 */}
        <div className="mb-4">
          <label className="block mb-2">별점</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* 사진 업로드 */}
        <div className="mb-4">
          <label className="block mb-2">사진 첨부</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex mt-2 gap-2">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`미리보기 ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰 내용을 입력해주세요"
            required
            rows="4"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          리뷰 등록하기
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
