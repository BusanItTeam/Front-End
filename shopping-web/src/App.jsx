import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
