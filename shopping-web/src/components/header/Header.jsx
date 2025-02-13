import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Search from "../search/Search";
import "../signup/SignUp";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // 현재 경로 가져오기
  const isMyPageActive = location.pathname.startsWith("/myPage");

  return (
    <header className="header-wrapper">
      <div className="frame-2">
        <img src="/Logo.png" alt="Logo" className="logo" />

        <nav className="frame-3">
          <a href="/" className="nav-link">
            Home
          </a>
          <div className="category-dropdown" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <Link to="/productCategory" className="nav-link">
              카테고리
            </Link>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/category/pants">바지</Link>
                </li>
                <li>
                  <Link to="/category/tops">상의</Link>
                </li>
                <li>
                  <Link to="/category/outerwear">아우터</Link>
                </li>
                <li>
                  <Link to="/category/dresses">원피스</Link>
                </li>
              </ul>
            )}
          </div>
          <a href="/contact" className="nav-link">
            Contact
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
          <a href="/login" className="nav-link">
            LogIn
          </a>
        </nav>
      </div>

      <Search />
      <div className="frame-5">
        <a href="/wishlist" className="icon wishlist"></a>
        <a href="/cart" className="icon cart"></a>
        <a href="/myPage" className={`icon ${isMyPageActive ? "user-active" : "user"}`}></a>
        <Link to="/" className="nav-link">
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
