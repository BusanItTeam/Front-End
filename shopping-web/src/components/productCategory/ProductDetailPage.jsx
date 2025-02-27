import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";
import axios from "axios";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { products, currentUser } = useMyContext();
  const [product, setProduct] = useState(null);
  const backendURL = "http://localhost:8080";
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (productId) {
      setSelectedProductId(productId);
    }
  }, [productId]);

  console.log("Selected Product ID:", selectedProductId);

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
    if (product && product.options && product.options.length > 0) {
      setSelectedOption(product.options[0]); // Default to first option
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  // const handleAddToCart = async (productId) => {
  //   if (!productId) {
  //     console.error("Product ID is missing.");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("JWT_TOKEN");

  //     if (!token) {
  //       console.error("No token found, user is not authenticated.");
  //       return;
  //     }

  //     const response = await api.post(
  //       `${import.meta.env.VITE_APP_API_URL}/api/cart/add`,
  //       { productId, quantity: 1 },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     toast.success("성공적으로 등록 완료", response.data);
  //   } catch (error) {
  //     console.error("Cart add error:", error.response?.data || error.message);
  //   }
  // };
  //카트에 담기(이미지포함)
  const handleAddToCart = async (productId, imageUrl) => {
    if (!productId) {
      console.error("Product ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("JWT_TOKEN");

      if (!token) {
        console.error("No token found, user is not authenticated.");
        return;
      }

      const response = await api.post(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/add`,
        { productId, quantity: 1, productImageUrl: imageUrl }, // 이미지 추가
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("성공적으로 등록 완료", response.data);
    } catch (error) {
      console.error("Cart add error:", error.response?.data || error.message);
    }
  };

  const handleAddToWishlist = () => {
    // 찜 로직
    alert("찜 목록에 추가되었습니다!");
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

  const dummyReviews = [
    { id: 1, author: "홍길동", rating: 5, comment: "아주 좋아요!" },
    { id: 2, author: "김철수", rating: 4, comment: "배송이 조금 느려요." },
  ];

  const dummyFaqs = [
    { id: 1, question: "배송은 얼마나 걸리나요?", answer: deliveryInfo },
    { id: 2, question: "반품 정책은 어떻게 되나요?", answer: refundPolicy },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
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
        <p className="text-xl font-semibold mt-4">{product.price}원</p>
        {/* 할인 정보 (더미 데이터) */}
        <p className="text-red-500">할인: 10%</p>

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
            onClick={() => handleAddToCart(selectedProductId, selectedImage)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            disabled={!selectedOption || selectedOption.inventory.stock <= 0}
          >
            장바구니
          </button>
          <button
            onClick={handleAddToWishlist}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            disabled={!selectedOption || selectedOption.inventory.stock <= 0}
          >
            찜하기
          </button>
          <button
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
          {dummyReviews.map((review) => (
            <div key={review.id} className="border rounded p-4 mt-2">
              <div className="flex items-center">
                <p className="font-semibold">{review.author}</p>
                <div className="ml-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <ul>
          {dummyFaqs.map((faq) => (
            <div key={faq.id} className="border rounded p-4 mt-2">
              <p className="font-semibold">{faq.question}</p>
              <p className="mt-2">{faq.answer}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailPage;
