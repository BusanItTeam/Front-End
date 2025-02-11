import React, { useState, useEffect } from "react";
import "./ProductCategory.css";

const ProductSection = ({ title, products, currentPage, setCurrentPage }) => {
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-section">
      <h2>{title}</h2>
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

const ProductCategory = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestCurrentPage, setBestCurrentPage] = useState(1);
  const [newCurrentPage, setNewCurrentPage] = useState(1);

  useEffect(() => {
    // 여기서 실제 데이터를 가져오는 API 호출을 수행합니다.
    // 예시를 위해 더미 데이터를 사용합니다.
    const dummyProducts = [
      {
        id: 1,
        name: "Breed Dry Dog Food",
        price: 100,
        image: "/71RdoeXxtrL 1.png",
      },
      {
        id: 2,
        name: "CANON EOS DSLR Camera",
        price: 360,
        image: "/eos-250d-03-500x500 1.png",
      },
      {
        id: 3,
        name: "ASUS FHD Gaming Laptop",
        price: 700,
        image: "/ideapad-gaming-3i-01-500x500 1.png",
      },
      {
        id: 4,
        name: "Curology Product Set",
        price: 500,
        image: "/curology-j7pKVQrTUsM-unsplash 1.png",
      },
      {
        id: 5,
        name: "Kids Electric Car",
        price: 960,
        image:
          "/New-Mercedes-Benz-Gtr-Licensed-Ride-on-Car-Kids-Electric-Toy-Car1.png",
      },
      {
        id: 6,
        name: "Jr. Zoom Soccer Cleats",
        price: 1160,
        image: "/Copa_Sense 1.png",
      },
      {
        id: 7,
        name: "GP11 Shooter USB Gamepad",
        price: 660,
        image: "/GP11_PRD3 1.png",
      },
      {
        id: 8,
        name: "Quilted Satin Jacket",
        price: 660,
        image:
          "/698717_Z8A1X_3475_001_100_0000_Light-Reversible-quilted-satin-jacket 1.png",
      },
      { id: 9, name: "New Product 1", price: 760, image: "/new-product-1.png" },
      {
        id: 10,
        name: "New Product 2",
        price: 860,
        image: "/new-product-2.png",
      },
      // 추가 제품...
    ];

    setBestProducts(dummyProducts.slice(0, 9));
    setNewProducts(dummyProducts.slice(5));
  }, []);

  return (
    <div className="product-category-container">
      <ProductSection
        title="BEST"
        products={bestProducts}
        currentPage={bestCurrentPage}
        setCurrentPage={setBestCurrentPage}
      />
      <ProductSection
        title="NEW"
        products={newProducts}
        currentPage={newCurrentPage}
        setCurrentPage={setNewCurrentPage}
      />
    </div>
  );
};

export default ProductCategory;
