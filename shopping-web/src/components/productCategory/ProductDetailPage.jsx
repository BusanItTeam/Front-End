import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { products } = useMyContext();
  const [product, setProduct] = useState(null);
  const backendURL = "http://localhost:8080";
  const [selectedImage, setSelectedImage] = useState(null);

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

  if (!product) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 메인 이미지 */}
      <div className="w-full md:w-1/2 mx-auto mb-4">
        {selectedImage ? (
          <img
            src={`${backendURL}${selectedImage}`}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
            style={{ width: "400px", height: "400px" }}
          />
        ) : (
          <img
            src="https://via.placeholder.com/400x300"
            alt="No Image"
            className="w-full h-auto object-cover rounded-lg shadow-md"
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
        <p className="text-red-500">할인: 10%</p>

        {/* 상품 사양 */}
        <h3 className="text-lg font-semibold mt-4">상품 사양</h3>
        <ul>
          <li>사이즈: Free</li>
          <li>재질: 면 100%</li>
        </ul>

        {/* 배송 정보 */}
        <h3 className="text-lg font-semibold mt-4">배송 정보</h3>
        <p>평균 2~3일 소요 (주말/공휴일 제외)</p>

        {/* 반품 및 교환 정책 */}
        <h3 className="text-lg font-semibold mt-4">반품 및 교환 정책</h3>
        <p>수령 후 7일 이내 (단, 상품 훼손 시 불가)</p>

        {/* 재고 상태 */}
        <p
          className={`mt-4 font-semibold ${
            product.stock > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          재고 상태: {product.stock > 0 ? "재고 있음" : "재고 없음"}
        </p>

        {/* 구매 버튼 */}
        <div className="mt-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            장바구니
          </button>
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            찜하기
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            바로 구매
          </button>
        </div>
      </div>

      {/* 리뷰 및 평점 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">리뷰</h2>
        <ul>
          <li>
            <p className="font-semibold">홍길동</p>
            <p>아주 좋아요!</p>
          </li>
          <li>
            <p className="font-semibold">김철수</p>
            <p>배송이 조금 느려요.</p>
          </li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <ul>
          <li>
            <p className="font-semibold">배송은 얼마나 걸리나요?</p>
            <p>평균 2~3일 소요 (주말/공휴일 제외)</p>
          </li>
          <li>
            <p className="font-semibold">반품 정책은 어떻게 되나요?</p>
            <p>수령 후 7일 이내 (단, 상품 훼손 시 불가)</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailPage;
