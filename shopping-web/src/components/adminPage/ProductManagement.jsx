import React, { useState, useEffect } from "react";
import { useMyContext } from "../../store/ContextApi"; // Context API import

function ProductManagement() {
  const { products, setProducts } = useMyContext(); // Context API 사용
  const [categories, setCategories] = useState([
    { id: "pants", name: "바지" },
    { id: "tops", name: "상의" },
    { id: "outerwear", name: "아우터" },
    { id: "dresses", name: "원피스" },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: null, // 이미지 파일 상태 추가
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockThreshold, setStockThreshold] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // 더미 데이터
    const dummyData = [
      {
        id: 1,
        name: "더미 상품 1",
        price: 20000,
        category: "tops",
        stock: 10,
        description: "더미 상품 1 설명",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "더미 상품 2",
        price: 30000,
        category: "pants",
        stock: 30,
        description: "더미 상품 2 설명",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        name: "더미 상품 3",
        price: 40000,
        category: "outerwear",
        stock: 5,
        description: "더미 상품 3 설명",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        name: "더미 상품 4",
        price: 50000,
        category: "dresses",
        stock: 40,
        description: "더미 상품 4 설명",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 5,
        name: "더미 상품 5",
        price: 60000,
        category: "tops",
        stock: 60,
        description: "더미 상품 5 설명",
        image: "https://via.placeholder.com/150",
      },
    ];
    setProducts(dummyData);
    // 실제 API 호출로 대체 (예시):
    // try {
    //   const response = await api.get('/products');
    //   setProducts(response.data);
    // } catch (error) {
    //   console.error("Error fetching products:", error);
    // }
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
    // const imageUrl = newProduct.image
    //   ? URL.createObjectURL(newProduct.image)
    //   : "https://via.placeholder.com/150"; // 이미지가 없을 경우 기본 이미지 URL 설정

    // 실제 API 호출로 대체 (예시):
    // try {
    //   const formData = new FormData();
    //   formData.append("image", newProduct.image);
    //   formData.append("name", newProduct.name);
    //   formData.append("price", newProduct.price);
    //   formData.append("category", newProduct.category);
    //   formData.append("stock", newProduct.stock);
    //   formData.append("description", newProduct.description);

    //   const response = await api.post('/products', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   });

    //   const newProductToAdd = response.data;

    //   setProducts([...products, newProductToAdd]); // Context API를 통해 상품 추가

    //   setNewProduct({
    //     name: "",
    //     price: "",
    //     category: "",
    //     stock: "",
    //     description: "",
    //     image: null,
    //   });
    //   alert("상품 추가 완료!");
    // } catch (error) {
    //   console.error("Error adding product:", error);
    //   alert("상품 추가 실패!");
    // }

    const imageUrl = newProduct.image
      ? URL.createObjectURL(newProduct.image)
      : "https://via.placeholder.com/150"; // 이미지가 없을 경우 기본 이미지 URL 설정

    const newProductToAdd = {
      ...newProduct,
      id: products.length + 1,
      image: imageUrl,
    };

    setProducts([...products, newProductToAdd]); // Context API를 통해 상품 추가

    setNewProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      image: null,
    });
    alert("상품 추가 완료!");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    // 상품 업데이트 로직 (실제 API 연동 시 구현 필요)
    setProducts(
      products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      )
    );
    setEditingProduct(null);
    alert("상품 수정 완료!");
  };

  const handleDeleteProduct = async (id) => {
    // 상품 삭제 로직 (실제 API 연동 시 구현 필요)
    const newProductList = products.filter((product) => product.id !== id);
    setProducts(newProductList);
    alert("삭제 완료!");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleStockThresholdChange = (e) => {
    setStockThreshold(Number(e.target.value));
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
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="border p-2"
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
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
      ... {/* 상품 목록 및 관리 UI */}
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
                key={product.id}
                className={product.stock <= stockThreshold ? "bg-red-100" : ""}
              >
                <td className="border p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.price}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
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
                name="category"
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="border p-2 mb-2 w-full"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
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
