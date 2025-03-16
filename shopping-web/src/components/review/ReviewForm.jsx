import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import toast from "react-hot-toast";
import { formatCurrency } from "../order/OrderHistory"; // OrderHistory에서 가져온 가격 포맷팅 함수

const ReviewForm = () => {
  const { token, backendURL } = useMyContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const product = location.state?.product || null; 
  const orderId = location.state?.orderId || null;
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 사용자가 주문한 상품 목록 가져오기
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const shippedProducts = response.data
          .filter(order => order.status === "SHIPPED") // 배송 완료된 상품만
          .flatMap(order => order.orderDetails);

        setOrderedProducts(shippedProducts);
      } catch (error) {
        toast.error("주문한 상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

 
  

  // 이미지 업로드 
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("JWT_TOKEN");
    e.preventDefault();
  
    if (!selectedProduct) {
      toast.error("리뷰를 작성할 상품을 선택해주세요.");
      return;
    }
  
    // 업로드된 이미지 URL 리스트
    const uploadedImageUrls = files.map(file => URL.createObjectURL(file));
  
    const reviewDTO = {
      productId: selectedProduct.productId,
      optionId: selectedProduct.optionId,
      rating,
      content,
      imageUrls: uploadedImageUrls, // 이미지 URL 리스트 추가
    };
  
    try {
      await api.post("/reviews", reviewDTO, {
        headers: { Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" },
      });
  
      toast.success("리뷰 작성 성공!");
      navigate(`/my-reviews/${selectedProduct.productId}/${selectedProduct.optionId}`);
    } catch (error) {
      toast.error("리뷰 작성 실패");
    }
  };
  

  if (loading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">리뷰 작성</h2>

      {/* 주문한 상품 선택  */}
<div className="mb-4">
  <label className="block mb-2 font-semibold">리뷰를 작성할 상품 선택</label>
  {orderedProducts.length > 0 ? (
    <select
      value={selectedProduct ? `${selectedProduct.productId}-${selectedProduct.optionId}` : ""}
      onChange={(e) => {
        const [productId, optionId] = e.target.value.split("-").map(Number);
        setSelectedProduct(orderedProducts.find((p) => p.productId === productId && p.optionId === optionId));
      }}
      className="w-full p-2 border rounded"
    >
      <option value="" disabled>상품을 선택하세요</option>
      {orderedProducts.map((product) => (
        <option key={`${product.productId}-${product.optionId}`} value={`${product.productId}-${product.optionId}`}>
          {product.productName} ({product.optionColor} / {product.optionSize}) - {formatCurrency(product.price * product.quantity)}
        </option>
      ))}
    </select>
  ) : (
    <p className="text-red-500">리뷰를 작성할 주문 상품이 없습니다.</p>
  )}
</div>

      {selectedProduct && (
        <>
          {/* 선택한 상품 정보 표시 */}
          <div className="mb-4 p-4 border rounded bg-gray-100 flex items-center">
            <img
              src={`${backendURL}${selectedProduct.image}`}
              alt={selectedProduct.productName}
              className="w-20 h-20 object-cover rounded mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{selectedProduct.productName}</h3>
              <p className="text-sm text-gray-500">{selectedProduct.optionColor} / {selectedProduct.optionSize}</p>
              <p className="text-sm">수량: {selectedProduct.quantity}개</p>
              <p className="text-sm font-semibold">{formatCurrency(selectedProduct.price * selectedProduct.quantity)}</p>
            </div>
          </div>

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
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
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
              className={`w-full py-2 rounded ${
                selectedProduct ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!selectedProduct}
            >
              리뷰 등록하기
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ReviewForm;
