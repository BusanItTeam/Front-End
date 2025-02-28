import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import DressesSidebar from "../../components/siderbar/DressesSidebar";
import OuterSidebar from "../../components/siderbar/OuterSidebar";
import Sidebar from "../../components/siderbar/Sidebar";
import TopsSidebar from "../../components/siderbar/TopsSidebar";
import { formatCurrency } from "../utils/Formatting"; // Helper function

const CategoryPage = () => {
  const { products } = useMyContext();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const backendURL = "http://localhost:8080";
  const { categoryName } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // categoryName과 일치하는 상품만 필터링
  const filteredProducts = products.filter(
    (product) => product.category?.name?.toLowerCase() === categoryName
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    // 1초마다 이미지 변경
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex + 1) % (currentProducts[0]?.images?.length || 1)
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentProducts]);

  useEffect(() => {
    // 페이지 변경 시 상품 목록 재계산
  }, [currentPage, products, categoryName]);

  const renderSidebar = () => {
    switch (categoryName) {
      case "pants":
        return <Sidebar />;
      case "tops":
        return <TopsSidebar />;
      case "outerwear":
        return <OuterSidebar />;
      case "dresses":
        return <DressesSidebar />;
      default:
        return null;
    }
  };

  const calculateDiscountedPrice = (price, discountRate) => {
    if (discountRate && discountRate > 0) {
      const discountAmount = (price * discountRate) / 100;
      return price - discountAmount;
    }
    return price;
  };

  return (
    <div className="flex">
      {renderSidebar()}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 capitalize">{categoryName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Link to={`/product/${product.productId}`}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${backendURL}${
                      product.images[currentImageIndex % product.images.length]
                        .imageUrl
                    }`}
                    alt={product.name}
                    className="object-contain transition-transform duration-300 hover:scale-105"
                    style={{
                      width: "400px",
                      height: "400px",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="No Image"
                    className="object-contain"
                    style={{ width: "400px", height: "400px" }}
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  {product.discountRate && product.discountRate > 0 ? (
                    <>
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
                        calculateDiscountedPrice(
                          product.price,
                          product.discountRate
                        )
                      )}
                    </>
                  ) : (
                    formatCurrency(product.price)
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {Array.from({
            length: Math.ceil(filteredProducts.length / productsPerPage),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-gray-300 focus:outline-none`}
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
