import React, { useState, useEffect } from "react";

const Homepage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ["/home1.jpg", "/home2.jpg", "/home3.jpg", "/home4.jpg"];
  const defaultImage = "https://via.placeholder.com/2100x700"; // 기본 이미지 URL 크기 변경

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getImageSrc = (index) => images[index] || defaultImage;

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[2100px] h-[700px] overflow-hidden rounded-lg shadow-lg mt-2">
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-black text-white border-none p-2 text-xl cursor-pointer z-10 opacity-70 hover:opacity-100"
        >
          &lt;
        </button>
        <img
          src={getImageSrc(currentImageIndex)}
          alt={`Carousel Image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain transition-transform duration-500"
        />
        <button
          onClick={goToNext}
          className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-black text-white border-none p-2 text-xl cursor-pointer z-10 opacity-70 hover:opacity-100"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Homepage;
