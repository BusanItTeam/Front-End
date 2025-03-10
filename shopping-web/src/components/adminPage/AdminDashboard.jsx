import React from "react";
import { Link } from "react-router-dom";
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
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 📌 사이드바 */}
      
    <AdminLayout />
      {/* 메인  */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <DashboardCard to="/admin/products" label="상품 관리" icon={<Package />} />
          <DashboardCard to="/admin/orders" label="주문 및 배송 관리" icon={<ShoppingCart />} />
          <DashboardCard to="/admin/members" label="회원 관리" icon={<Users />} />
          <DashboardCard to="/admin/support" label="고객 지원" icon={<Headset />} />
          <DashboardCard to="/admin/inquiries" label="1:1 문의 답변" icon={<MessageSquare />} />
        </div>
      </main>
    </div>
  );
};

/* 📌 사이드바 링크 컴포넌트 */
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

/* 📌 대시보드 카드 컴포넌트 */
const DashboardCard = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
    >
      <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
      <span className="text-lg font-semibold text-gray-800">{label}</span>
    </Link>
  );
};

export default AdminDashboard;
