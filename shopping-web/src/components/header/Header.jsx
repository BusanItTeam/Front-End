import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../search/Search";
import { useLocation } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { Menu, X } from "lucide-react"; // 햄버거 메뉴와 X 아이콘

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림 상태
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
    <header className="flex items-center justify-between px-16 py-4 bg-white shadow-md relative z-50 font-[\'Poppins\', sans-serif]">
      <Link to="/" className="absolute left-24">
        <img src="/Logo.png" alt="Logo" className="h-10" />
      </Link>

      {/* 메뉴 부분: 반응형 네브바 메뉴 */}
      <div className="xl:flex hidden gap-12 items-center text-lg font-semibold text-gray-800 ml-70 mx-auto">
        <Link to="/" className="hover:text-pink-500">
          Home
        </Link>
        <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
          <Link to="/category/all" className="hover:text-pink-500">
          Category
          </Link>
          {showDropdown && (
            <ul className="absolute bg-gray-100 w-40 shadow-lg mt-2 z-50 rounded-md text-base">
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
        <Link to="/contact" className="hover:text-pink-500">
          Contact
        </Link>
        <Link to="/about" className="hover:text-pink-500">
          About
        </Link>
        {!token ? (
          <>
            <Link to="/signup" className="hover:text-pink-500">
              Sign Up
            </Link>
            <Link to="/login" className="hover:text-pink-500">
              LogIn
            </Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} className="hover:text-pink-500">
              Logout
            </button>
            {isAdmin && (
              <Link to="/admin" className="hover:text-pink-500">
                manager
              </Link>
            )}
          </>
        )}
      </div>

      {/* 햄버거 메뉴: 큰 화면에서 보이는 메뉴 (xl 이상) */}
      <div className="flex items-center gap-6">
        {/* 햄버거 버튼: xl 이하 화면에서 고정 위치 */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden absolute right-6 top-1/2 transform -translate-y-1/2">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 햄버거 메뉴가 열릴 때 보이는 메뉴 */}
      {menuOpen && (
        <div className="xl:hidden absolute top-16 right-0 w-64 bg-white shadow-lg p-4 rounded-md">
          <Link to="/" className="block py-2 hover:text-pink-500">
            홈
          </Link>
          <div className="relative">
            <Link to="/category/all" className="block py-2 hover:text-pink-500">
              카테고리
            </Link>
            <ul className="text-gray-500 w-full mt-2 rounded-md text-base">
              <li className="p-2 hover:text-gray-700">
                <Link to={`/category/all`}>전체</Link>
              </li>
              {categories.map((category) => (
                <li key={category.categoryId} className="p-2 hover:text-gray-700">
                  <Link to={`/category/${category.name?.toLowerCase()}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/contact" className="block py-2 hover:text-pink-500">
            Contact
          </Link>
          <Link to="/about" className="block py-2 hover:text-pink-500">
            About
          </Link>
          {!token ? (
            <>
              <Link to="/signup" className="block py-2 hover:text-pink-500">
                Sign Up
              </Link>
              <Link to="/login" className="block py-2 hover:text-pink-500">
                LogIn
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="block py-2 hover:text-pink-500">
                LogOut
              </button>
              {isAdmin && (
                <Link to="/admin" className="block py-2 hover:text-pink-500">
                  관리자
                </Link>
              )}
            </>
          )}
        </div>
      )}

      {/* 상단 아이콘들 */}
      <div className="flex items-center gap-6">
        <div className="hidden 2xl:block">
          <Search />
        </div>
        <Link to="/wishlist" className="w-8 h-8 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/Wishlist.png')" }}></Link>
        <Link to="/cart" className="w-8 h-8 bg-contain bg-no-repeat" style={{ backgroundImage: "url('/Cart=Off.png')" }}></Link>
        <Link to="/myPage" className={`w-8 h-8 bg-contain bg-no-repeat ${isMyPageActive ? "bg-[url('/user2.png')]" : "bg-[url('/user.png')]"}`}></Link>
      </div>
    </header>
  );
};

export default Header;
