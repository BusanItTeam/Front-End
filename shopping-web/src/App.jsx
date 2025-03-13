import React from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
  useParams, // useParams 훅 import
} from "react-router-dom";
import "./App.css";
import { Header } from "./components/header/Header";
import SignUp from "./components/signup/SignUp";
import { ContextProvider, useMyContext } from "./store/ContextApi";
import Login from "./components/login/Login";
import ProductCategory from "./components/productCategory/ProductCategory";
import CategoryPage from "./components/productCategory/CategoryPage"; // CategoryPage 임포트
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
import { Toaster } from "react-hot-toast";
import ProductDetailPage from "./components/productCategory/ProductDetailPage";
import Wishlist from "./components/wishlist/Wishlist";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import MyPoint from "./components/myPage/MyPoint";
import PointHistory from "./components/myPage/PointHistory";

import ReviewForm from "./components/review/ReviewForm";
import OrderHistory from "./components/order/OrderHistory";
import AdminLayout from "./components/adminPage/AdminLayout";
import NotFound from "./components/Auth/NotFound";

const AdminRoute = ({ children }) => {
  const { isAdmin } = useMyContext();
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ContextProvider>
      <Toaster position="bottom-right" />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/productcategory" element={<ProductCategory />} /> */}
          <Route path="/category/:categoryName" element={<CategoryPage />} />{" "}
          {/* CategoryPage 라우트 */}
          <Route path="/product/:productId" element={<ProductDetailPage />} />
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
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/myPage/PointHistory" element={<MyPoint />} />
          <Route path="/points-history" element={<PointHistory />} />
          <Route path="/review/:orderItemId" element={<ReviewForm />} />
          <Route path="/orders/history" element={<OrderHistory />} />
          <Route path="*" element={<NotFound />} />
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
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
        <Footer />
      </Router>
    </ContextProvider>
  );
}

export default App;
