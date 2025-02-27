import React, { useState, useEffect } from "react";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/Api";

function ProductManagement() {
  const { products, setProducts, fetchProducts } = useMyContext();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    imageFiles: [], // multiple image upload
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockThreshold, setStockThreshold] = useState(10);
  const backendURL = "http://localhost:8080";
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [showEditFormFor, setShowEditFormFor] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [options, setOptions] = useState([{ color: "", size: "", stock: "" }]);

  useEffect(() => {
    console.log("Products data:", products);
  }, [products]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, imageFiles: e.target.files });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("JWT_TOKEN");

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", Number(newProduct.price));
      formData.append("description", newProduct.description);
      formData.append("categoryId", newProduct.categoryId);

      if (newProduct.imageFiles) {
        for (let i = 0; i < newProduct.imageFiles.length; i++) {
          formData.append("imageFiles", newProduct.imageFiles[i]);
        }
      }

      // Add options as JSON
      formData.append("options", JSON.stringify(options));

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await api.post(`/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (fetchProducts) {
        fetchProducts();
      } else {
        console.error("fetchProducts is not a function!");
        alert("상품 목록 갱신 실패!");
        return;
      }

      setNewProduct({
        name: "",
        price: "",
        description: "",
        imageFiles: [],
        categoryId: "",
      });
      setOptions([{ color: "", size: "", stock: "" }]); // Reset options
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

      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("price", Number(editingProduct.price));
      formData.append("description", editingProduct.description);
      formData.append("categoryId", editingProduct.category.categoryId);

      if (newImageFiles) {
        for (let i = 0; i < newImageFiles.length; i++) {
          formData.append("imageFiles", newImageFiles[i]);
        }
      }

      // Add options as JSON
      formData.append("options", JSON.stringify(options));

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await api.put(`/products/${editingProduct.productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProducts();
      setShowEditFormFor(null);
      setEditingProduct(null);
      setNewImageFiles(null);
      alert("상품 수정 완료!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("상품 수정 실패!");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
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
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditFormFor(product.productId);
    setOptions(
      product.options.map((option) => ({
        color: option.color,
        size: option.size,
        stock: option.inventory.stock,
      }))
    );
  };

  const handleStockThresholdChange = (e) => {
    setStockThreshold(Number(e.target.value));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleProductClick = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  const handleNewImageChange = (e) => {
    setNewImageFiles(e.target.files);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      const response = await api.post(
        "/categories",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories([...categories, response.data]);
      fetchProducts();
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("정말로 이 카테고리를 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("JWT_TOKEN");
        await api.delete(`/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(
          categories.filter((category) => category.categoryId !== id)
        );
        fetchProducts();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleOptionChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...options];
    list[index][name] = value;
    setOptions(list);
  };

  const handleAddOption = () => {
    setOptions([...options, { color: "", size: "", stock: "" }]);
  };

  const handleRemoveOption = (index) => {
    const list = [...options];
    list.splice(index, 1);
    setOptions(list);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">상품 관리</h2>
      {/* 카테고리 관리 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">카테고리 관리</h3>
        <form onSubmit={handleAddCategory} className="mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="새 카테고리 이름"
            className="border p-2 mr-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            카테고리 추가
          </button>
        </form>
        <ul>
          {categories.map((category) => (
            <li
              key={category.categoryId}
              className="flex justify-between items-center mb-2"
            >
              {category.name}
              <button
                onClick={() => handleDeleteCategory(category.categoryId)}
                className="bg-red-500 text-white px-2 py-1 text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
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
            name="imageFiles"
            onChange={handleImageChange}
            className="border p-2"
            multiple
          />
        </div>

        {/* Options Input */}
        <h4 className="text-lg font-semibold mt-4">상품 옵션</h4>
        {options.map((option, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              name="color"
              value={option.color}
              onChange={(e) => handleOptionChange(index, e)}
              placeholder="색상"
              className="border p-2"
            />
            <input
              type="text"
              name="size"
              value={option.size}
              onChange={(e) => handleOptionChange(index, e)}
              placeholder="사이즈"
              className="border p-2"
            />
            <input
              type="number"
              name="stock"
              value={option.stock}
              onChange={(e) => handleOptionChange(index, e)}
              placeholder="재고"
              className="border p-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className="bg-red-500 text-white px-2 py-1"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="bg-green-500 text-white px-4 py-2 mt-2"
        >
          옵션 추가
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
          상품 등록
        </button>
      </form>
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
      <div>
        <h3 className="text-xl font-semibold mb-2">상품 목록</h3>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">이미지</th>
              <th className="border p-2">상품명</th>
              <th className="border p-2">가격</th>
              <th className="border p-2">카테고리</th>
              <th className="border p-2">옵션</th>
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
                      product.options?.reduce(
                        (acc, option) => acc + option.inventory.stock,
                        0
                      ) <= stockThreshold
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <td className="border p-2">
                      <div className="flex flex-wrap">
                        {product.images &&
                          product.images.map((image, index) => (
                            <img
                              key={index}
                              src={`${backendURL}${image.imageUrl}`}
                              alt={product.name}
                              className="w-16 h-16 object-cover m-1"
                            />
                          ))}
                      </div>
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
                    <td className="border p-2">
                      {product.options?.map((option, index) => (
                        <div key={index}>
                          색상: {option.color}, 사이즈: {option.size}, 재고:{" "}
                          {option.inventory.stock}
                        </div>
                      ))}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 mr-2"
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.productId);
                        }}
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                  {expandedProductId === product.productId && (
                    <tr>
                      <td colSpan="6" className="border p-2">
                        <div className="flex flex-col">
                          <p>
                            <b>설명:</b> {product.description}
                          </p>
                          {/* Display Options */}
                          <h4 className="text-lg font-semibold mt-2">
                            상품 옵션:
                          </h4>
                          <ul>
                            {product.options?.map((option, index) => (
                              <li key={index}>
                                색상: {option.color}, 사이즈: {option.size},
                                재고: {option.inventory.stock}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
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
                            <p>이미지</p>
                            <input
                              type="file"
                              name="imageFiles"
                              onChange={handleNewImageChange}
                              className="border p-2 mb-2 w-full"
                              multiple
                            />
                            <h4 className="text-lg font-semibold mt-4">
                              상품 옵션
                            </h4>
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-4 gap-2 mb-2"
                              >
                                <input
                                  type="text"
                                  name="color"
                                  value={option.color}
                                  onChange={(e) => handleOptionChange(index, e)}
                                  placeholder="색상"
                                  className="border p-2"
                                />
                                <input
                                  type="text"
                                  name="size"
                                  value={option.size}
                                  onChange={(e) => handleOptionChange(index, e)}
                                  placeholder="사이즈"
                                  className="border p-2"
                                />
                                <input
                                  type="number"
                                  name="stock"
                                  value={option.stock}
                                  onChange={(e) => handleOptionChange(index, e)}
                                  placeholder="재고"
                                  className="border p-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(index)}
                                  className="bg-red-500 text-white px-2 py-1"
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={handleAddOption}
                              className="bg-green-500 text-white px-4 py-2 mt-2"
                            >
                              옵션 추가
                            </button>

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
