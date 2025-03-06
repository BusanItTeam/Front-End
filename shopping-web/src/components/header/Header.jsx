import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Search from "../search/Search";
import "../signup/SignUp";
import { useLocation } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const isMyPageActive = location.pathname.startsWith("/myPage");
  const navigate = useNavigate();
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin, products } =
    useMyContext();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedIsAdmin = localStorage.getItem("IS_ADMIN");
    if (storedIsAdmin) {
      setIsAdmin(JSON.parse(storedIsAdmin));
    }
  }, [token, isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    //navigate("/login");
  };

  // products 상태가 변경될 때마다 categories를 업데이트합니다.
  useEffect(() => {
    // products가 존재하고 비어있지 않은지 확인
    if (products && products.length > 0) {
      // products에서 category 정보만 추출하여 중복을 제거합니다.
      const uniqueCategories = [
        ...new Map(
          products.map((product) => [
            product.category.categoryId,
            product.category,
          ])
        ).values(),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  return (
    <header className="header-wrapper">
      <div className="frame-2">
        <Link to="/">
          <img src="/Logo.png" alt="Logo" className="logo" />
        </Link>

        <nav className="frame-3">
          <Link to="/" className="nav-link">
            홈
          </Link>
          <div
            className="category-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <Link to="/productCategory" className="nav-link">
              카테고리
            </Link>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link to={`/category/all`}>전체 상품</Link>{" "}
                  {/* 전체 상품 링크 */}
                </li>
                {categories.map((category) => (
                  <li key={category.categoryId}>
                    <Link to={`/category/${category.name?.toLowerCase()}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <a href="/contact" className="nav-link">
            Contact
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
          {!token ? (
            <>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
              <Link to="/login" className="nav-link">
                LogIn
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="nav-link">
                LogOut
              </button>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  관리자
                </Link>
              )}
            </>
          )}
        </nav>
      </div>

      <Search />
      <div className="frame-5">
        <a href="/wishlist" className="icon wishlist"></a>
        <a href="/cart" className="icon cart"></a>
        <a
          href="/myPage"
          className={`icon ${isMyPageActive ? "user-active" : "user"}`}
        ></a>
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
      </div>
    </header>
  );
};

export default Header;
