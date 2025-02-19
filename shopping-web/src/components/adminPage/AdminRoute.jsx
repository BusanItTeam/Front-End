import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

const AdminRoute = ({ children }) => {
  const { isAdmin } = useMyContext();

  if (!isAdmin) {
    // 관리자가 아닌 경우, 로그인 페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
