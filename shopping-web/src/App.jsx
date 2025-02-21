import React from "react";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/header/Header";
import SignUp from "./components/signup/SignUp";
import { ContextProvider, useMyContext } from "./store/ContextApi"; // Context API import
import Login from "./components/login/Login";
import ProductCategory from "./components/productCategory/ProductCategory";
import Pants from "./components/productCategory/Pants";
import Tops from "./components/productCategory/Tops";
import Outerwear from "./components/productCategory/Outerwear";
import Dresses from "./components/productCategory/Dresses";
import Footer from "./components/footer/Footer";
import CartPage from "./components/cart/CartPage";

import EditProfile from "./components/myPage/EditProfile";
import OrderComplete from "./components/order/OrderComplete";





import BoardList from "./components/myPage/BoardList";
import InquiryForm from "./components/myPage/InquiryForm";
import CustomerSupport from "./components/adminPage/CustomerSupport";
import MemberManagement from "./components/adminPage/MemberManagement";
import OrderManagement from "./components/adminPage/OrderManagement";
import ProductManagement from "./components/adminPage/ProductManagement";
import AdminDashboard from "./components/adminPage/AdminDashboard";
import MyPage from "./components/myPage/MyPage";
import Homepage from "./components/home/Homepage";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";
import MemberManagementDetails from "./components/adminPage/MemberManagementDetails";

import OrderPage from "./components/order/OrderPage";
import Payment from "./components/order/Payment";

import InquiryManagement from "./components/adminPage/InquiryManagement";

// 관리자 권한 확인 컴포넌트
const AdminRoute = ({ children }) => {
  const { isAdmin } = useMyContext();
  //사용자가 어드민이 아니라면 홈으로 리다이렉트
  return isAdmin ? children : <Navigate to="/" />;
};


function App() {
  return (
    <ContextProvider>
      <Router>
        <Header />
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/productcategory" element={<ProductCategory />} />
          <Route path="/category/pants" element={<Pants />} />
          <Route path="/category/tops" element={<Tops />} />
          <Route path="/category/outerwear" element={<Outerwear />} />
          <Route path="/category/dresses" element={<Dresses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/myPage/editProfile" element={<EditProfile />} />
          <Route path="/myPage/boardList" element={<BoardList />} />
          <Route path="/myPage/inquiryForm" element={<InquiryForm />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/orderpage" element={<OrderPage />} />
          <Route path="/orderpage/payment" element={<Payment />} />
          <Route path="/orderpage/ordercomplete" element={<OrderComplete />} />


     

          {/* 관리자 페이지 라우트 */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <AdminRoute>
                <MemberManagement />
              </AdminRoute>
            }
          />
         <Route
            path="/admin/members/:userId"
            element={
              <AdminRoute>
                <MemberManagementDetails />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <AdminRoute>
                <CustomerSupport />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <AdminRoute>
                <InquiryManagement />
              </AdminRoute>
            }
          />

          {/* OAuth2 리다이렉트  */}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>  
        <Footer />
      </Router> 
    </ContextProvider>
  );
}

export default App;
