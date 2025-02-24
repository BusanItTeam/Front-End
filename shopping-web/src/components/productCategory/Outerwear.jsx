import React, { useState } from "react";
import OuterSidebar from "../siderbar/OuterSidebar";
import { useMyContext } from "../../store/ContextApi";

const Outerwere = () => {
  const { products } = useMyContext();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const backendURL = "http://localhost:8080"; // backendURL 추가

  // 아우터 카테고리(ID: 3)에 맞는 상품만 필터링
  const outerwearProducts = products.filter(
    (product) => product.category?.categoryId === 3
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = outerwearProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex">
      <OuterSidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">아우터</h2>
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
            { length: Math.ceil(outerwearProducts.length / productsPerPage) },
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

export default Outerwere;
