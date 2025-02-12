import React, { useState, useEffect } from "react";

const Dresses = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    //더미사진
    const dummyProducts = [
      {
        id: 1,
        name: "Breed Dry Dog Food",
        price: 100,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 2,
        name: "CANON EOS DSLR Camera",
        price: 360,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 3,
        name: "ASUS FHD Gaming Laptop",
        price: 700,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 4,
        name: "Curology Product Set",
        price: 500,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 5,
        name: "Kids Electric Car",
        price: 960,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 6,
        name: "Jr. Zoom Soccer Cleats",
        price: 1160,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 7,
        name: "GP11 Shooter USB Gamepad",
        price: 660,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 8,
        name: "Quilted Satin Jacket",
        price: 660,
        image: "/woman-6626615_1280.jpg",
      },
      {
        id: 9,
        name: "Quilted Satin Jacket",
        price: 760,
        image: "/woman-6626615_1280.jpg",
      },
      // 추가 제품
    ];
    setProducts(dummyProducts);
  }, []);

  // 현재 페이지의 제품들을 계산합니다.
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-category-container">
      <h2>원피스</h2>
      <div className="product-category">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
          (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Dresses;
