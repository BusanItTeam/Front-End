import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import axios from "axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/Formatting";
import api from "../../services/Api";
import CustomerFAQ from "../adminPage/CustomerFAQ";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { products, token, error, backendURL, currentUser, isAdmin } =
    useMyContext();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]); // [1]
  const [faqs, setFaqs] = useState([]); // [1]
  const [isCartOpen, setIsCartOpen] = useState(false); // [1]
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProduct = products.find(
      (p) => p.productId === Number(productId)
    );
    setProduct(selectedProduct);
    if (
      selectedProduct &&
      selectedProduct.images &&
      selectedProduct.images.length > 0
    ) {
      setSelectedImage(selectedProduct.images[0].imageUrl);
    }
  }, [productId, products]);

  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = [
        ...new Map(
          products.map((product) => [
            product.category.categoryId,
            product.category,
          ])
        ).values(),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // 찜 상태 확인 및 초기화
  useEffect(() => {
    const checkWishlistStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("JWT_TOKEN");
        if (!token) {
          setIsWishlisted(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${backendURL}/api/wishlist/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (typeof response.data === "boolean") {
          setIsWishlisted(response.data);
        } else if (
          response.data &&
          typeof response.data.isWishlisted === "boolean"
        ) {
          setIsWishlisted(response.data.isWishlisted);
        } else {
          setIsWishlisted(false);
        }
      } catch (error) {
        setIsWishlisted(false);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      checkWishlistStatus();
    }
  }, [productId]);

  useEffect(() => {
    console.log("✅ 최종 상태 업데이트 (렌더링 후):", isWishlisted);
  }, [isWishlisted]);

  // 찜 로직
  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      if (isWishlisted) {
        const response = await axios.delete(
          `${backendURL}/api/wishlist/product/${productId}`,
          { headers }
        );
        if (response.status === 200) {
          toast.success("찜 목록에서 삭제되었습니다.");
          setIsWishlisted(false);
        }
      } else {
        const wishListDTO = {
          productId: Number(productId),
          optionId: selectedOption ? selectedOption.optionId : null, // 선택된 옵션이 있을 때 optionId 추가
        };
        const response = await axios.post(
          `${backendURL}/api/wishlist`,
          wishListDTO,
          { headers }
        );
        if (response.status === 200) {
          toast.success("찜 목록에 추가되었습니다.");
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error("찜하기 오류:", error);
      toast.error("찜하기에 실패했습니다.");
    }
  };

  // 바로 구매
  const handleDirectBuy = () => {
    if (!selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    const directBuyInfo = {
      productId: productId,
      quantity: quantity,
      optionId: selectedOption.optionId,
      product: product, // 상품 정보
    };

    localStorage.setItem("directBuyInfo", JSON.stringify(directBuyInfo));
    navigate("/orderpage");
  };

  useEffect(() => {
    if (product && product.options && product.options.length > 0) {
      setSelectedOption(product.options[0]); // Default to first option
    }
  }, [product]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/product/${productId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("리뷰를 가져오는데 실패했습니다.");
      }
    };

    fetchReviews();
  }, [productId]);

  // FAQ 로딩
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

  if (!product) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const calculateDiscountedPrice = (price, discountRate) => {
    if (discountRate && discountRate > 0) {
      const discountAmount = (price * discountRate) / 100;
      return price - discountAmount;
    }
    return price;
  };

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    console.log("🔑 현재 JWT 토큰:", token);

    // 요청 데이터 생성

    const requestData = {
      optionId: selectedOption.optionId,
      productId: product.productId,
      quantity: quantity,
    };

    console.log("장바구니 추가 요청 데이터:", requestData);

    try {
      const response = await api.post(`/cart/add`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("장바구니에 추가되었습니다!");
        setIsCartOpen(true); // 팝업 열기
      }
    } catch (error) {
      console.error("🚨 장바구니 추가 실패:", error);
      toast.error("장바구니에 추가에 실패했습니다.");
    }
  };

  const handleOptionChange = (e) => {
    const optionId = parseInt(e.target.value, 10);
    const selected = product.options.find((opt) => opt.optionId === optionId);
    setSelectedOption(selected);
  };

  // 더미 데이터
  const productSpecifications = [
    { name: "사이즈", value: "Free" },
    { name: "재질", value: "면 100%" },
  ];

  const deliveryInfo = "평균 2~3일 소요 (주말/공휴일 제외)";
  const refundPolicy = "수령 후 7일 이내 (단, 상품 훼손 시 불가)";

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    try {
      // 리뷰 삭제 API 호출
      await api.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 리뷰 목록 업데이트
      setReviews(reviews.filter((review) => review.reviewId !== reviewId));
      toast.success("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("리뷰 삭제에 실패했습니다.");
    }
  };

  const CartPopup = ({ onClose }) => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-transparent">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">장바구니</h2>
          <p>장바구니에 상품이 담겼습니다.</p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                onClose(); // 팝업 닫기
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              계속 쇼핑하기
            </button>
            <button
              onClick={() => {
                navigate("/cart"); // 장바구니 페이지로 이동
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              장바구니로 이동하기
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="w-64 flex-shrink-0 bg-gray-100 p-4 border-r border-gray-200 fixed top-0 left-0 h-full">
        <h3 className="text-lg font-semibold mb-4">카테고리</h3>
        <ul>
          <li key="all">
            <Link to="/category/all" className="block p-2 hover:bg-gray-200">
              전체
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.categoryId}>
              <Link
                to={`/category/${category.name?.toLowerCase()}`}
                className="block p-2 hover:bg-gray-200"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-grow container mx-auto px-4 py-8 ml-64">
        {/* 메인 이미지 */}
        <div className="w-full md:w-1/2 mx-auto mb-4">
          {selectedImage ? (
            <img
              src={`${backendURL}${selectedImage}`}
              alt={product.name}
              className="object-contain rounded-lg shadow-md"
              style={{ width: "400px", height: "400px" }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/400x300"
              alt="No Image"
              className="object-contain rounded-lg shadow-md"
              style={{ width: "400px", height: "400px" }}
            />
          )}
        </div>

        {/* 썸네일 목록 */}
        {product.images && product.images.length > 0 && (
          <div className="flex overflow-x-auto space-x-2 py-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="w-24 h-24 rounded-md shadow-md cursor-pointer flex-shrink-0"
                onClick={() => handleThumbnailClick(image.imageUrl)}
              >
                <img
                  src={`${backendURL}${image.imageUrl}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        {/* 상품 정보 (기존 코드 유지) */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-700 mt-2">{product.description}</p>
          {product.discountRate && product.discountRate > 0 ? (
            <>
              <p className="text-xl font-semibold mt-4">
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "red",
                    marginRight: "10px",
                  }}
                >
                  {formatCurrency(product.price)}
                </span>
                {formatCurrency(
                  calculateDiscountedPrice(product.price, product.discountRate)
                )}
              </p>
            </>
          ) : (
            <p className="text-xl font-semibold mt-4">
              {formatCurrency(product.price)}
            </p>
          )}

          {/* 할인 정보  */}
          {product.discountRate && product.discountRate > 0 && (
            <p className="text-red-500">할인율: {product.discountRate}%</p>
          )}

          {/* 상품 사양 */}
          <h3 className="text-lg font-semibold mt-4">상품 사양</h3>
          <ul>
            {productSpecifications.map((spec, index) => (
              <li key={index}>
                {spec.name}: {spec.value}
              </li>
            ))}
          </ul>

          {/* 배송 정보 */}
          <h3 className="text-lg font-semibold mt-4">배송 정보</h3>
          <p>{deliveryInfo}</p>

          {/* 반품 및 교환 정책 */}
          <h3 className="text-lg font-semibold mt-4">반품 및 교환 정책</h3>
          <p>{refundPolicy}</p>

          {/* 옵션 선택 */}
          {product.options && product.options.length > 0 && (
            <div className="mt-4">
              <label htmlFor="option" className="mr-2 font-semibold">
                옵션 선택:
              </label>
              <select
                id="option"
                onChange={handleOptionChange}
                className="border rounded w-auto px-2 py-1"
                value={selectedOption ? selectedOption.optionId : ""}
              >
                {product.options.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.color ? `[ 색상: ${option.color} ] , ` : ""}
                    {option.size ? `[ 사이즈: ${option.size} ] ` : ""}
                    {/* 재고: {option.inventory.stock} */}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 재고 상태 */}
          <p
            className={`mt-4 font-semibold ${
              selectedOption && selectedOption.inventory.stock > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            재고 상태:{" "}
            {selectedOption
              ? selectedOption.inventory.stock > 0
                ? "재고 있음"
                : "재고 없음"
              : "옵션을 선택하세요"}
          </p>

          {/* 수량 선택 */}
          <div className="mt-4">
            <label htmlFor="quantity" className="mr-2 font-semibold">
              수량:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={selectedOption ? selectedOption.inventory.stock : 0}
              className="border rounded w-20 px-2 py-1"
              disabled={!selectedOption}
            />
          </div>

          {/* 구매 버튼 */}
          <div className="mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              disabled={!selectedOption || selectedOption.inventory.stock <= 0}
            >
              장바구니
            </button>
            <button
              onClick={handleAddToWishlist}
              className={`text-white font-bold py-2 px-4 rounded ${
                loading
                  ? "bg-gray-400 cursor-not-allowed" // 로딩 중 스타일
                  : isWishlisted === null
                  ? "bg-gray-500 hover:bg-gray-700" // 초기 상태 스타일
                  : isWishlisted
                  ? "bg-red-500 hover:bg-red-700" // 찜한 상태 스타일
                  : "bg-gray-500 hover:bg-gray-700" // 찜 안 한 상태 스타일
              }`}
              disabled={loading} // 로딩 중에는 버튼 비활성화
            >
              {console.log("🛠 렌더링된 isWishlisted 상태:", isWishlisted)}
              {loading
                ? "로딩..."
                : isWishlisted === null
                ? "찜하기"
                : isWishlisted
                ? "찜 취소"
                : "찜하기"}
            </button>
            <button
              onClick={handleDirectBuy}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={!selectedOption || selectedOption.inventory.stock <= 0}
            >
              바로 구매
            </button>
          </div>
        </div>

        {/* 리뷰 및 평점 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">리뷰</h2>
          <ul>
            {reviews.map((review) => (
              <div key={review.reviewId} className="border rounded p-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="font-semibold">{review.user.userName}</p>
                    <div className="ml-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* 리뷰 삭제 버튼 (작성자 또는 관리자만) */}
                  {(review.user.userId === currentUser?.userId || isAdmin) && (
                    <button
                      onClick={() => handleDeleteReview(review.reviewId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-2">{review.content}</p>
              </div>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">자주 묻는 질문</h2>
          <div>
            {faqs.map((faq) => (
              <div
                key={faq.faqId}
                className="border rounded p-4 mt-2 shadow-sm"
              >
                <p className="font-semibold">{faq.question}</p>
                <p className="mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 장바구니 팝업 */}
      {isCartOpen && <CartPopup onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};

export default ProductDetailPage;
