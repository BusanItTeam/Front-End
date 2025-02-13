import React, { useState, useEffect } from "react";

const Dresses = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    // Dummy Products
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
    ];
    setProducts(dummyProducts);
  }, []);

  // Calculate current products for the page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">원피스</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700 font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
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
  );
};

export default Dresses;
