import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { formatCurrency } from "../utils/Formatting";

const ProductCategory = () => {
  const { products } = useMyContext();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const backendURL = "http://localhost:8080";
  const [categories, setCategories] = useState([]);

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

  // 최신 상품부터 표시하도록 정렬
  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const calculateDiscountedPrice = (price, discountRate) => {
    if (discountRate && discountRate > 0) {
      const discountAmount = (price * discountRate) / 100;
      return price - discountAmount;
    }
    return price;
  };

  return (
    <div className="flex">
      {/* 사이드바 */}
      <div className="w-48 bg-gray-100 p-4 border-r border-gray-200">
        <h3 className="text-lg font-semibold mb-4">카테고리</h3>
        <ul>
          <li key="all">
            <Link
              to="/category/all"
              className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
            >
              전체
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.categoryId}>
              <Link
                to={`/category/${category.name?.toLowerCase()}`}
                className="block p-2 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">전체</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Link to={`/product/${product.productId}`}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${backendURL}${product.images[0].imageUrl}`}
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
            length: Math.ceil(products.length / productsPerPage),
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

export default ProductCategory;
