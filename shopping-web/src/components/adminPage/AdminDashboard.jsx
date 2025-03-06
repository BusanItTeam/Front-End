import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/admin/products"
          className="bg-blue-500 text-white p-4 rounded"
        >
          상품 관리
        </Link>
        <Link
          to="/admin/orders"
          className="bg-green-500 text-white p-4 rounded"
        >
          주문 및 배송 관리
        </Link>
        <Link
          to="/admin/members"
          className="bg-yellow-500 text-white p-4 rounded"
        >
          회원 관리
        </Link>
        <Link
          to="/admin/support"
          className="bg-purple-500 text-white p-4 rounded"
        >
          고객 지원
        </Link>
        <Link
          to="/admin/inquiries"
          className="bg-purple-500 text-white p-4 rounded"
        >
          1:1 문의 답변
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
