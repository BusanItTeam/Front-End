import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import SignUp from "./components/signup/SignUp";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
