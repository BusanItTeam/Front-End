import Login from "./components/Login";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import SignUp from "./components/signup/SignUp";
import { ContextProvider } from "./store/ContextApi";

function App() {
  return (
    <ContextProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
    </ContextProvider>
  );
}

export default App;
