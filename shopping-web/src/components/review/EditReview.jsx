import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import toast from "react-hot-toast";

const EditReview = () => {
  const { token } = useMyContext();
  const navigate = useNavigate();
  const { productId, optionId } = useParams(); 

  const [loading, setLoading] = useState(true);
  const [reviewId, setReviewId] = useState(null); 
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 기존 리뷰 데이터 
  useEffect(() => {
    const fetchReview = async () => {
      console.log("Fetching reviews for:", productId, optionId);
  
      try {
        const response = await api.get(`/reviews/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("📌 API Response Data:", response.data);
  
        const existingReview = response.data.find(
          (r) => r.productId === Number(productId) && r.optionId === Number(optionId)
        );
  
        if (!existingReview) {
          console.log("❌ 리뷰를 찾을 수 없습니다.", response.data);
          toast.error("해당 리뷰를 찾을 수 없습니다.");
          navigate(-1);
          return;
        }
  
        console.log("✅ Found Review:", existingReview);
        setReviewId(existingReview.reviewId);  
        setRating(existingReview.rating + 1); //0부터 시작해서 +1 
        setContent(existingReview.content);
        setPreviews(existingReview.imageUrls || []);
      } catch (error) {
        console.error("❌ 리뷰 정보를 불러오는데 실패했습니다.", error);
        toast.error("리뷰 정보를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReview();
  }, [token, productId, optionId, navigate]);
  

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  // 리뷰 수정 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!reviewId) {
      toast.error("리뷰 정보를 불러오지 못했습니다.");
      console.error("❌ 리뷰 ID 없음.");
      return;
    }
  
    const updatedReview = {
      rating,
      content,
      imageUrls: files.map(file => URL.createObjectURL(file)), 
    };
  
    console.log("🔄 PUT 요청 보냄:", `/reviews/${reviewId}`, updatedReview);
  
    try {
      const response = await api.put(`/reviews/${reviewId}`, updatedReview, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
  
      console.log("리뷰 수정 응답:", response.data);
      toast.success("리뷰 수정 성공!");
      navigate("/orders/history");

    } catch (error) {
      console.error("리뷰 수정 실패:", error.response || error);
      toast.error("리뷰 수정 실패");
    }
  };
  

  if (loading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">리뷰 수정</h2>

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
                className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* 사진 업로드 */}
        <div className="mb-4">
          <label className="block mb-2">사진 수정</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div className="flex mt-2 gap-2">
            {previews.map((preview, index) => (
              <img key={index} src={preview} alt={`미리보기 ${index}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="5"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          리뷰 수정 완료
        </button>
      </form>
    </div>
  );
};

export default EditReview;
