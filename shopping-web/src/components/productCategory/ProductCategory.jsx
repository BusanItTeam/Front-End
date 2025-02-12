import React, { useState, useEffect } from "react";

const ProductCategory = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestCurrentPage, setBestCurrentPage] = useState(1);
  const [newCurrentPage, setNewCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = () => {
      const dummyProducts = [
        {
          id: 1,
          name: "Best Product 1",
          price: 100,
          image: "/woman-2799490_1280.jpg",
        },
        {
          id: 2,
          name: "Best Product 2",
          price: 200,
          image: "/best-product2.jpg",
        },
        {
          id: 3,
          name: "Best Product 3",
          price: 150,
          image: "/best-product3.jpg",
        },
        {
          id: 4,
          name: "Best Product 4",
          price: 180,
          image: "/best-product4.jpg",
        },
        {
          id: 5,
          name: "Best Product 5",
          price: 120,
          image: "/best-product5.jpg",
        },
        {
          id: 6,
          name: "Best Product 6",
          price: 220,
          image: "/best-product6.jpg",
        },
        {
          id: 7,
          name: "Best Product 7",
          price: 190,
          image: "/best-product7.jpg",
        },
        {
          id: 8,
          name: "Best Product 8",
          price: 160,
          image: "/best-product8.jpg",
        },
        {
          id: 9,
          name: "Best Product 9",
          price: 170,
          image: "/best-product9.jpg",
        },
        {
          id: 10,
          name: "Best Product 10",
          price: 210,
          image: "/best-product10.jpg",
        },
        {
          id: 11,
          name: "New Product 1",
          price: 110,
          image: "/new-product1.jpg",
        },
        {
          id: 12,
          name: "New Product 2",
          price: 210,
          image: "/new-product2.jpg",
        },
        {
          id: 13,
          name: "New Product 3",
          price: 140,
          image: "/new-product3.jpg",
        },
        {
          id: 14,
          name: "New Product 4",
          price: 170,
          image: "/new-product4.jpg",
        },
        {
          id: 15,
          name: "New Product 5",
          price: 130,
          image: "/new-product5.jpg",
        },
        {
          id: 16,
          name: "New Product 6",
          price: 230,
          image: "/new-product6.jpg",
        },
        {
          id: 17,
          name: "New Product 7",
          price: 200,
          image: "/new-product7.jpg",
        },
        {
          id: 18,
          name: "New Product 8",
          price: 150,
          image: "/woman-6626615_1280.jpg",
        },
        {
          id: 19,
          name: "New Product 9",
          price: 190,
          image: "/new-product9.jpg",
        },
        {
          id: 20,
          name: "New Product 10",
          price: 220,
          image: "/new-product10.jpg",
        },
      ];

      setBestProducts(dummyProducts.slice(0, 10));
      setNewProducts(dummyProducts.slice(10));
    };

    fetchProducts();
  }, []);

  const paginate = (pageNumber, setPageFunction) => setPageFunction(pageNumber);

  const renderProducts = (products, currentPage) => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

    return currentProducts.map((product) => (
      <div
        key={product.id}
        className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg mb-2">{product.name}</h3>
          <p className="font-bold text-base mt-auto">${product.price}</p>
        </div>
      </div>
    ));
  };

  const renderPagination = (products, currentPage, setPageFunction) => {
    return (
      <div className="flex justify-center mt-5">
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1, setPageFunction)}
              className="mx-1 px-3 py-1 border border-gray-300 bg-gray-100 hover:bg-gray-200"
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">BEST</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {renderProducts(bestProducts, bestCurrentPage)}
        </div>
        {renderPagination(bestProducts, bestCurrentPage, setBestCurrentPage)}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">NEW</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {renderProducts(newProducts, newCurrentPage)}
        </div>
        {renderPagination(newProducts, newCurrentPage, setNewCurrentPage)}
      </div>
    </div>
  );
};

export default ProductCategory;
