import React, { useState, useEffect } from "react";
import "./Search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const backendURL = "http://localhost:8080";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        try {
          const response = await fetch(
            `${backendURL}/api/products/search?keyword=${searchTerm}`
          );
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
          } else {
            console.error("Failed to fetch search results");
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchResults.length > 0 && (
        <div className="search-dropdown">
          {searchResults.map((result) => (
            <a
              href={`/product/${result.productId}`}
              key={result.productId}
              className="search-item"
            >
              {result.images && result.images.length > 0 ? (
                <img
                  src={`${backendURL}${result.images[0].imageUrl}`}
                  alt={result.name}
                  className="search-item-image"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/50x50" // 기본 이미지 URL
                  alt="No Image"
                  className="search-item-image"
                />
              )}
              <span className="search-item-name">{result.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
