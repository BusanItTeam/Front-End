import "../components/Header.css";
import Search from "./Search";

export const Header = () => {
  return (
    <header className="header-wrapper">
      {/* 로고 및 네비게이션 */}
      <div className="frame-2">
        <img src="/Logo.png" alt="Logo" className="logo" />

        <nav className="frame-3">
          <a href="/" className="nav-link">Home</a>
          <a href="/contact" className="nav-link">Contact</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/signup" className="nav-link">Sign Up</a>
        </nav>
      </div>

        {/* 검색 */}
        <Search />
        <div className="frame-5">
          <a href="/wishlist" className="icon wishlist"></a>
          <a href="/cart" className="icon cart"></a>
          <a href="/user" className="icon user"></a>
        </div>
     
    </header>
  );
};
