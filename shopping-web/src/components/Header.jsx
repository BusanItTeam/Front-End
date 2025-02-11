import { Link } from "react-router-dom";
import "../components/Header.css";
import Search from "./Search";
import "../components/signup/SignUp";

export const Header = () => {
  return (
    <header className="header-wrapper">
      <div className="frame-2">
        <img src="/Logo.png" alt="Logo" className="logo" />

        <nav className="frame-3">

          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/contact" className="nav-link">
            Contact
          </a>
          <a href="/about" className="nav-link">
            About
          </a>
          <a href="/signup" className="nav-link">
            Sign Up
          </a>
          <a href="/login" className="nav-link">
            LogIn
          </a>
        </nav>
      </div>

      {/* 검색 */}
      <Search />
      <div className="frame-5">
        <a href="/wishlist" className="icon wishlist"></a>
        <a href="/cart" className="icon cart"></a>
        <a href="/user" className="icon user"></a>

          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/SignUp" className="nav-link">
            Sign Up
          </Link>
        </nav>
      </div>

      <Search />
      <div className="frame-5">
        <Link to="/wishlist" className="icon wishlist"></Link>
        <Link to="/cart" className="icon cart"></Link>
        <Link to="/user" className="icon user"></Link>
      </div>
    </header>
  );
};
