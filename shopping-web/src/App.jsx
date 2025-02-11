import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import SignUp from "./components/signup/SignUp";
import { ContextProvider } from "./store/ContextApi";
import Login from "./components/Login";
import ProductCategory from "./components/productCategory/ProductCategory";
import Pants from "./components/productCategory/Pants";
import Tops from "./components/productCategory/Tops";
import Outerwear from "./components/productCategory/Outerwear";
import Dresses from "./components/productCategory/Dresses";

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
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
