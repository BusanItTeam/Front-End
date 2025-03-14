import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Headset,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-lg p-5 flex flex-col">
        {/* 로고 */}
        <div className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <LayoutDashboard className="w-7 h-7 text-gray-700" />
          <span>Admin</span>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col gap-4">
          <SidebarLink
            to="/admin/products"
            icon={<Package />}
            label="상품 관리"
          />
          <SidebarLink
            to="/admin/orders"
            icon={<ShoppingCart />}
            label="주문 및 배송 관리"
          />
          <SidebarLink to="/admin/members" icon={<Users />} label="회원 관리" />
          <SidebarLink
            to="/admin/support"
            icon={<Headset />}
            label="고객 지원"
          />
          <SidebarLink
            to="/admin/inquiries"
            icon={<MessageSquare />}
            label="1:1 문의 답변"
          />
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto p-5">{children}</main>
    </div>
  );
};

/* 사이드바 링크 */
const SidebarLink = ({ to, icon, label, className = "" }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition ${className}`}
    >
      <span className="w-6 h-6">{icon}</span>
      {label}
    </Link>
  );
};

export default AdminLayout;
