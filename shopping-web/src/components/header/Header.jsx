import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../search/Search";
import { useLocation } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const isMyPageActive = location.pathname.startsWith("/myPage");
  const navigate = useNavigate();
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin, products } = useMyContext();
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
  };

  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = [...new Map(products.map((product) => [product.category.categoryId, product.category])).values()];
      setCategories(uniqueCategories);
    }
  }, [products]);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-40">
        <Link to="/">
          <img src="/Logo.png" alt="Logo" className="h-10" />
        </Link>
        <nav className="flex gap-12">
          <Link to="/" className="text-gray-800 font-bold hover:text-orange-500">
            홈
          </Link>
          <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <Link to="/category/all" className="text-gray-800 font-bold hover:text-orange-500">
              카테고리
            </Link>
            {showDropdown && (
              <ul className="absolute bg-gray-100 w-40 shadow-lg mt-2 z-50">
                <li className="p-2 hover:bg-gray-200">
                  <Link to={`/category/all`}>전체</Link>
                </li>
                {categories.map((category) => (
                  <li key={category.categoryId} className="p-2 hover:bg-gray-200">
                    <Link to={`/category/${category.name?.toLowerCase()}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link to="/contact" className="text-gray-800 font-bold hover:text-orange-500">
            Contact
          </Link>
          <Link to="/about" className="text-gray-800 font-bold hover:text-orange-500">
            About
          </Link>
          {!token ? (
            <>
              <Link to="/signup" className="text-gray-800 font-bold hover:text-orange-500">
                Sign Up
              </Link>
              <Link to="/login" className="text-gray-800 font-bold hover:text-orange-500">
                LogIn
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="text-gray-800 font-bold hover:text-orange-500">
                LogOut
              </button>
              {isAdmin && (
                <Link to="/admin" className="text-gray-800 font-bold hover:text-orange-500">
                  관리자
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
      <Search />
      <div className="flex items-center gap-6">
        <Link to="/wishlist" className="w-8 h-8 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/Wishlist.png')" }}></Link>
        <Link to="/cart" className="w-8 h-8 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/Cart=Off.png')" }}></Link>
        <Link to="/myPage" className={`w-8 h-8 bg-contain bg-no-repeat ${isMyPageActive ? "bg-[url('/user2.png')]" : "bg-[url('/user.png')]"}`}></Link>
      </div>
    </header>
  );
};

export default Header;
