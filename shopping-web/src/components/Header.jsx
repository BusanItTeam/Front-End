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
