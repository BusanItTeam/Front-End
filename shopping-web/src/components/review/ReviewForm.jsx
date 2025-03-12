import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import toast from "react-hot-toast";

const ReviewForm = () => {
  const { productId } = useParams(); // 상품 ID
  const { token, backendURL, currentUser } = useMyContext();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 상품 ID로 상품 정보 가져오기 (API 필요)
    const fetchProduct = async () => {
      try {
        // 예시: /api/products/:productId
        const response = await api.get(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("상품 정보를 가져오는데 실패했습니다.");
      }
    };

    fetchProduct();
  }, [productId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        productId: product.productId, // 상품 ID
        rating: rating,
        content: content,
      };

      // 리뷰 생성 API 호출
      await api.post("/reviews", reviewData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("리뷰가 성공적으로 작성되었습니다!");
      navigate(`/product/${product.productId}`); // 상품 상세 페이지로 이동
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("리뷰 작성에 실패했습니다.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {product.name}에 대한 리뷰 작성
      </h2>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            평점:
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="5">5 - 아주 좋아요!</option>
            <option value="4">4 - 좋아요</option>
            <option value="3">3 - 괜찮아요</option>
            <option value="2">2 - 별로에요</option>
            <option value="1">1 - 최악이에요</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            리뷰 내용:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            리뷰 작성 완료
          </button>
        </div>
      </form>
      <button onClick={() => navigate(`/product/${product.productId}`)}>
        돌아가기
      </button>
    </div>
  );
};

export default ReviewForm;
