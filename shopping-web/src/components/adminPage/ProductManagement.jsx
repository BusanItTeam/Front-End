import React, { useState, useEffect } from "react";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";

function ProductManagement() {
  const { products, setProducts, fetchProducts } = useMyContext();
  const [categories, setCategories] = useState([
    { categoryId: "1", name: "바지" },
    { categoryId: "2", name: "상의" },
    { categoryId: "3", name: "아우터" },
    { categoryId: "4", name: "원피스" },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
    stock: "",
    description: "",
    imageUrl: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockThreshold, setStockThreshold] = useState(10);
  const backendURL = "http://localhost:8080"; // backendURL 추가
  const [expandedProductId, setExpandedProductId] = useState(null); // 드롭다운 상태 관리
  const [showEditFormFor, setShowEditFormFor] = useState(null); // 수정 폼을 보여줄 상품 ID

  // Pagination 관련 state 추가
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    console.log("Products data:", products);
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, imageUrl: e.target.files[0] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("JWT_TOKEN");

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", Number(newProduct.price)); // 숫자 타입으로 변환
      formData.append("stock", Number(newProduct.stock)); // 숫자 타입으로 변환
      formData.append("description", newProduct.description);
      formData.append("categoryId", newProduct.categoryId);

      if (newProduct.imageUrl) {
        formData.append("imageUrl", newProduct.imageUrl);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await api.post(`/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // fetchProducts 함수가 제대로 호출되는지 확인
      if (fetchProducts) {
        fetchProducts();
      } else {
        console.error("fetchProducts is not a function!");
        alert("상품 목록 갱신 실패!");
        return; // 함수 실행 중단
      }

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: null,
        categoryId: "",
      });
      alert("상품 추가 완료!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("상품 추가 실패!");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      await api.put(
        `/products/${editingProduct.productId}`,
        {
          ...editingProduct,
          price: Number(editingProduct.price),
          stock: Number(editingProduct.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchProducts();
      setShowEditFormFor(null); // 수정 폼 닫기
      setEditingProduct(null);
      alert("상품 수정 완료!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("상품 수정 실패!");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      alert("삭제 완료!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("삭제 실패!");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditFormFor(product.productId); // 수정 폼을 보여줄 상품 ID 설정
  };

  const handleStockThresholdChange = (e) => {
    setStockThreshold(Number(e.target.value));
  };

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 현재 페이지에 해당하는 상품 목록 계산
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // 상품 드롭다운 핸들러
  const handleProductClick = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">상품 관리</h2>
      {/* 상품 등록 폼 */}
      <form onSubmit={handleAddProduct} className="mb-8">
        <h3 className="text-xl font-semibold mb-2">상품 등록</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="상품명"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="가격"
            className="border p-2"
            required
          />
          <select
            name="categoryId"
            value={newProduct.categoryId}
            onChange={handleInputChange}
            className="border p-2"
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            placeholder="재고"
            className="border p-2"
            required
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="상품 설명"
            className="border p-2 col-span-2"
            required
          ></textarea>
          <input
            type="file"
            name="imageUrl"
            onChange={handleImageChange}
            className="border p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
          상품 등록
        </button>
      </form>
      {/* 재고 알림 설정 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">재고 알림 설정</h3>
        <label className="block">
          재고 알림 기준:
          <input
            type="number"
            value={stockThreshold}
            onChange={handleStockThresholdChange}
            className="border p-2 ml-2"
          />
          개 이하
        </label>
      </div>
      {/* 상품 목록 및 관리 UI */}
      <div>
        <h3 className="text-xl font-semibold mb-2">상품 목록</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">이미지</th>
              <th className="border p-2">상품명</th>
              <th className="border p-2">가격</th>
              <th className="border p-2">카테고리</th>
              <th className="border p-2">재고</th>
              <th className="border p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts &&
              currentProducts.map((product) => (
                <React.Fragment key={product.productId}>
                  <tr
                    onClick={() => handleProductClick(product.productId)}
                    className={`cursor-pointer ${
                      product.stock <= stockThreshold ? "bg-red-100" : ""
                    }`}
                  >
                    <td className="border p-2">
                      <img
                        src={`${backendURL}${product.imageUrl}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.price}</td>
                    <td className="border p-2">
                      {
                        categories.find(
                          (category) =>
                            category.categoryId === product.category.categoryId
                        )?.name
                      }
                    </td>
                    <td className="border p-2">{product.stock}</td>
                    <td className="border p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 이벤트 버블링 방지
                          handleEditProduct(product);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 mr-2"
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 이벤트 버블링 방지
                          // 삭제 확인 메시지 표시
                          if (window.confirm("정말로 삭제하시겠습니까?")) {
                            handleDeleteProduct(product.productId);
                          }
                        }}
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                  {/* 드롭다운 형태의 상세 정보 */}
                  {expandedProductId === product.productId && (
                    <tr>
                      <td colSpan="6" className="border p-2">
                        <div className="flex flex-col">
                          <p>
                            <b>설명:</b> {product.description}
                          </p>
                          {/* 다른 상세 정보들을 추가할 수 있습니다. */}
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 수정 폼 */}
                  {showEditFormFor === product.productId && (
                    <tr>
                      <td colSpan="6" className="border p-2">
                        <div className="bg-white p-4 rounded">
                          <h3 className="text-xl font-semibold mb-2">
                            상품 수정
                          </h3>
                          <form onSubmit={handleUpdateProduct}>
                            <p>상품명</p>
                            <input
                              type="text"
                              name="name"
                              value={editingProduct.name || ""}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  name: e.target.value,
                                })
                              }
                              className="border p-2 mb-2 w-full"
                              required
                            />
                            <p>가격</p>
                            <input
                              type="number"
                              name="price"
                              value={editingProduct.price || ""}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  price: e.target.value,
                                })
                              }
                              className="border p-2 mb-2 w-full"
                              required
                            />
                            <p>카테고리</p>
                            <select
                              name="categoryId"
                              value={editingProduct.category?.categoryId || ""}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  category: { categoryId: e.target.value },
                                })
                              }
                              className="border p-2 mb-2 w-full"
                              required
                            >
                              {categories.map((category) => (
                                <option
                                  key={category.categoryId}
                                  value={category.categoryId}
                                >
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <p>재고</p>
                            <input
                              type="number"
                              name="stock"
                              value={editingProduct.stock || ""}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  stock: e.target.value,
                                })
                              }
                              className="border p-2 mb-2 w-full"
                              required
                            />
                            <p>상품 설명</p>
                            <textarea
                              name="description"
                              value={editingProduct.description || ""}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  description: e.target.value,
                                })
                              }
                              className="border p-2 mb-2 w-full"
                              required
                            ></textarea>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 mr-2"
                              >
                                수정
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowEditFormFor(null)}
                                className="bg-gray-500 text-white px-4 py-2"
                              >
                                취소
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination UI */}
      <div className="flex justify-center mt-4">
        {Array.from({
          length: Math.ceil(products.length / productsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductManagement;
