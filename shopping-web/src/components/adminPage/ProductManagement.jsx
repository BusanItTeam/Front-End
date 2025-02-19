import React, { useState, useEffect } from "react";
import { useMyContext } from "../../store/ContextApi";
import Api from "../../services/Api";
import toast from "react-hot-toast";

function ProductManagement() {
  const { products, setProducts } = useMyContext();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "", // categoryId로 변경
    stock: "",
    description: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockThreshold, setStockThreshold] = useState(10);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await Api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("카테고리 목록을 불러오는데 실패했습니다.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await Api.get("/admin/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("상품 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("categoryId", newProduct.categoryId); // categoryId로 변경
      formData.append("stock", newProduct.stock);
      formData.append("description", newProduct.description);

      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const response = await Api.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        price: "",
        categoryId: "", // categoryId로 변경
        stock: "",
        description: "",
        image: null,
      });
      toast.success("상품이 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("상품 등록에 실패했습니다.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("JWT_TOKEN");
      if (!token) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("price", editingProduct.price);
      formData.append("categoryId", editingProduct.categoryId); // categoryId로 변경
      formData.append("stock", editingProduct.stock);
      formData.append("description", editingProduct.description);

      // 이미지가 변경된 경우에만 추가
      if (editingProduct.image) {
        formData.append("image", editingProduct.image);
      }

      const response = await Api.put(
        `/products/${editingProduct.productId}`, // productId로 변경
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        products.map((product) =>
          product.productId === editingProduct.productId // productId로 변경
            ? response.data
            : product
        )
      );
      setEditingProduct(null);
      toast.success("상품이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("상품 수정에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    // productId로 변경
    try {
      await Api.delete(`/products/${productId}`); // productId로 변경
      setProducts(
        products.filter((product) => product.productId !== productId)
      ); // productId로 변경
      toast.success("상품이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("상품 삭제에 실패했습니다.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product }); // 수정 시 기존 상품 정보 복사
  };

  const handleStockThresholdChange = (e) => {
    setStockThreshold(Number(e.target.value));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">상품 관리</h2>
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
            name="categoryId" // categoryId로 변경
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
            name="image"
            onChange={handleImageChange}
            className="border p-2"
          />
        </div>
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
              <th className="border p-2">재고</th>
              <th className="border p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.productId} // productId로 변경
                className={product.stock <= stockThreshold ? "bg-red-100" : ""}
              >
                <td className="border p-2">
                  <img
                    src={product.imageUrl} // imageUrl로 변경
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.price}</td>
                <td className="border p-2">
                  {
                    categories.find(
                      (category) => category.categoryId === product.categoryId
                    )?.name
                  }
                </td>{" "}
                // categoryId로 변경
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.productId)} // productId로 변경
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">상품 수정</h3>
            <form onSubmit={handleUpdateProduct}>
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="border p-2 mb-2 w-full"
                required
              />
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="border p-2 mb-2 w-full"
                required
              />
              <select
                name="categoryId" // categoryId로 변경
                value={editingProduct.categoryId}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    categoryId: e.target.value,
                  })
                }
                className="border p-2 mb-2 w-full"
                required
              >
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="stock"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: e.target.value,
                  })
                }
                className="border p-2 mb-2 w-full"
                required
              />
              <textarea
                name="description"
                value={editingProduct.description}
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
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
