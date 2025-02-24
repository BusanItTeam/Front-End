// CategoryPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import DressesSidebar from "../../components/siderbar/DressesSidebar";
import OuterSidebar from "../../components/siderbar/OuterSidebar";
import Sidebar from "../../components/siderbar/Sidebar";
import TopsSidebar from "../../components/siderbar/TopsSidebar";

const CategoryPage = () => {
  const { products } = useMyContext();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const backendURL = "http://localhost:8080"; // backendURL 추가
  const { categoryName } = useParams(); // Get categoryName from URL

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

  return (
    <div className="flex">
      {renderSidebar()}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">{categoryName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={`${backendURL}${product.imageUrl}`} // backendURL 추가
                alt={product.name}
                className="w-full h-48 object-cover"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 font-bold">{product.price}원</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {Array.from(
            { length: Math.ceil(filteredProducts.length / productsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 ${
                  currentPage === i + 1
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-700"
                } rounded hover:bg-gray-300 focus:outline-none`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
