import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import axios from "axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/Formatting";

const CategoryPage = () => {
  // 상태 변수 선언
  const { products } = useMyContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [categories, setCategories] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]); // 베스트상품 상태 추가

  // 상수 선언
  const productsPerPage = 16;
  const backendURL = "http://localhost:8080";
  const { categoryName } = useParams();

  // 카테고리 설정
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

  // 위시리스트 상태 불러오기
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("JWT_TOKEN");
        if (!token) return;
        const response = await axios.get(`${backendURL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data.map((item) => item.productId));
      } catch (error) {
        console.error("🚨 위시리스트 불러오기 오류:", error);
      }
    };
    fetchWishlist();
  }, []);

  // 이미지 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        products.forEach((product) => {
          if (product.images.length > 1) {
            newIndexes[product.productId] =
              (newIndexes[product.productId] || 0) + 1;
            if (newIndexes[product.productId] >= product.images.length) {
              newIndexes[product.productId] = 0;
            }
          }
        });
        return newIndexes;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [products]);

  // 베스트상품 불러오기
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/products/best-selling/${categoryName}?limit=8`
        );
        setBestSellingProducts(response.data);
      } catch (error) {
        console.error("베스트상품 불러오기 오류:", error);
      }
    };
    fetchBestSellingProducts();
  }, [categoryName]);

  // 위시리스트 추가/삭제 함수
  const toggleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (!token) return;
      if (wishlist.includes(productId)) {
        await axios.delete(`${backendURL}/api/wishlist/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter((id) => id !== productId));
        toast.success("위시리스트에서 제거되었습니다.");
      } else {
        await axios.post(
          `${backendURL}/api/wishlist`,
          { productId, optionId: null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, productId]);
        toast.success("위시리스트에 추가되었습니다.");
      }
    } catch (error) {
      console.error("🚨 위시리스트 추가/삭제 오류:", error);
      toast.error("위시리스트 처리 중 오류가 발생했습니다.");
    }
  };

  // 필터링 및 정렬
  const filteredProducts = products.filter((product) =>
    categoryName === "all"
      ? true
      : product.category?.name?.toLowerCase() === categoryName
  );
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // 할인 가격 계산
  const calculateDiscountedPrice = (price, discountRate) => {
    if (discountRate && discountRate > 0) {
      const discountAmount = (price * discountRate) / 100;
      return price - discountAmount;
    }
    return price;
  };

  // 렌더링
  return (
    <div className="flex">
      {/* 사이드바 */}
      <div className="w-48 bg-gray-100 p-4 border-r border-gray-200">
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

      {/* 상품 목록 */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        {/* 베스트상품 섹션 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">베스트</h3>
          {bestSellingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellingProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white shadow-md rounded-lg overflow-hidden relative"
                >
                  <Link to={`/product/${product.productId}`}>
                    <img
                      src={`${backendURL}${product.images[0]?.imageUrl}`}
                      alt={product.name}
                      className="object-cover w-full h-64"
                    />
                    <div className="p-4">
                      
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      
                      <span className="text-gray-500 line-through mr-2">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {formatCurrency(
                          calculateDiscountedPrice(
                            product.price,
                            product.discountRate
                          )
                        )}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>현재 베스트상품이 없습니다.</p>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-6 capitalize">
          {categoryName === "all" ? "전체 상품" : categoryName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md rounded-lg overflow-hidden relative"
            >
              <Link to={`/product/${product.productId}`}>
                <img
                  src={`${backendURL}${
                    product.images[currentImageIndex[product.productId] || 0]
                      ?.imageUrl
                  }`}
                  alt={product.name}
                  className="object-cover w-full h-64"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.productId);
                      }}
                      className={`text-xl ${
                        wishlist.includes(product.productId)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      ♥
                    </button>
                  </div>
                  {product.discountRate && product.discountRate > 0 ? (
                    <>
                      <span className="text-gray-500 line-through mr-2">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {formatCurrency(
                          calculateDiscountedPrice(
                            product.price,
                            product.discountRate
                          )
                        )}
                      </span>
                    </>
                  ) : (
                    <p>{formatCurrency(product.price)}</p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          {Array.from({
            length: Math.ceil(filteredProducts.length / productsPerPage),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
