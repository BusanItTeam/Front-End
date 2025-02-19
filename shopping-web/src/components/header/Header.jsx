import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Search from "../search/Search";
import "../signup/SignUp";
import { useLocation } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi"; // ContextApi import 추가

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const isMyPageActive = location.pathname.startsWith("/myPage");
  const navigate = useNavigate();
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
  useMyContext(); // ContextApi에서 currentUser와 isAdmin 가져오기

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN"); // 로컬 스토리지 jwt 토큰 삭제
    localStorage.removeItem("USER"); // 로컬스토리지 삭제 user
    localStorage.removeItem("IS_ADMIN"); //로컬스토리지 어드민 삭제
    if(setToken) setToken(null);  
    if(setCurrentUser) setCurrentUser(null);
    if(setIsAdmin) setIsAdmin(false);

    navigate("/login");
  };
  
  return (
    <header className="header-wrapper">
      <div className="frame-2">
      
          <img src="/Logo.png" alt="Logo" className="logo" />


        <nav className="frame-3">
          <Link to="/" className="nav-link">
            Home
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
          {!token ? ( //로그인상태되면 가입,로그인페이지안보임
            <>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
              <Link to="/login" className="nav-link">
                LogIn
              </Link>
            </>
          ) : (
            <button
                onClick={handleLogout}
                className="nav-link"
              >
                LogOut
              </button>
          )}
          {isAdmin && (
            <Link to="/admin" className="nav-link">
              관리자
            </Link> // admin으로 로그인했을때만 보임
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
