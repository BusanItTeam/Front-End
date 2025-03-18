import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/Formatting";

const Homepage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bestProducts, setBestProducts] = useState([]);
  const images = ["/home1.jpg", "/home2.jpg", "/home3.jpg", "/home4.jpg"];
  const defaultImage = "https://via.placeholder.com/2100x700";
  const backendURL = "http://localhost:8080";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/products/best-selling?limit=8`);
        setBestProducts(response.data);
      } catch (error) {
        console.error("베스트 상품 불러오기 오류:", error);
      }
    };
    fetchBestSellingProducts();
  }, []);

  const calculateDiscountedPrice = (price, discountRate) => {
    if (discountRate && discountRate > 0) {
      const discountAmount = (price * discountRate) / 100;
      return price - discountAmount;
    }
    return price;
  };

  
  const getImageSrc = (index) => images[index] || defaultImage;

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[2100px] h-[700px] overflow-hidden rounded-lg mt-2">
        <button onClick={goToPrevious} className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-black text-white border-none p-2 text-xl cursor-pointer z-10 opacity-70 hover:opacity-100">
          &lt;
        </button>
        <img src={getImageSrc(currentImageIndex)} alt={`Carousel Image ${currentImageIndex + 1}`} className="w-full h-full object-contain transition-transform duration-500" />
        <button onClick={goToNext} className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-black text-white border-none p-2 text-xl cursor-pointer z-10 opacity-70 hover:opacity-100">
          &gt;
        </button>
      </div>
      {/* <div className="text-center my-8">
        <p>루나몰은</p>
        <p>화면너머의 여러분에게 따뜻한 쇼핑메이트이고 싶습니다.</p>
        <p>일상에 스며드는 실용적인 옷들부터</p>
        <p>가장 빛이 나야하는 순간까지 언제나 함께 하겠습니다.</p>
      </div> */}

      <section className="w-full max-w-[2100px] mt-12 mb-20 px-20">
        <h2 className="text-2xl font-bold mb-6 text-center">베스트상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestProducts.map((product) => (
            <Link to={`/product/${product.productId}`} key={product.productId} className="block">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <img src={`${backendURL}${product.images[0]?.imageUrl}`} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-4">
                  
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  
                 <span className="text-gray-500 line-through mr-2">
                    {formatCurrency(product.price)}
                 </span>
                  <span className="text-red-500 font-semibold">
                    {formatCurrency(
                      calculateDiscountedPrice(
                        product.price,
                        product.discountRate
                      )
                      )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
