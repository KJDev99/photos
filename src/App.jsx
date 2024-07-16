import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./components/logIn";
import SignUp from "./components/Signup";
import Header from "./components/header";
import { useState } from "react";
import "./index.css";
import "./App.css";
import GetPdf from "./pages/getPdf";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    localStorage.removeItem("username");
  };
  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleLogin} />} />
        <Route path="/getpdf" element={<GetPdf />} />
      </Routes>
    </div>
  );
};

export default App;
