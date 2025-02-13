import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { Header } from "./components/header/Header";
import SignUp from "./components/signup/SignUp";
import { ContextProvider } from "./store/ContextApi";
import Login from "./components/login/Login";
import ProductCategory from "./components/productCategory/ProductCategory";
import Pants from "./components/productCategory/Pants";
import Tops from "./components/productCategory/Tops";
import Outerwear from "./components/productCategory/Outerwear";
import Dresses from "./components/productCategory/Dresses";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/siderbar/Sidebar";
import Mypage from "./components/myPage/myPage";
import CartPage from "./components/cart/CartPage";
import Payment from "./components/cart/Payment";
import EditProfile from "./components/myPage/EditProfile";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/productcategory" element={<ProductCategory />} />

          <Route path="/category/pants" element={<Pants />} />
          <Route path="/category/tops" element={<Tops />} />
          <Route path="/category/outerwear" element={<Outerwear />} />
          <Route path="/category/dresses" element={<Dresses />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignUp />} />

          <Route path="/myPage" element={<Mypage />} />
          <Route path="/myPage/editProfile" element={<EditProfile />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>

        <Footer />
      </Router>
    </ContextProvider>
  );
}

export default App;
