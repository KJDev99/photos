import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./components/logIn";
import SignUp from "./components/Signup";
import Header from "./components/header";
import { useState } from "react";
import ImgUploa2 from "./components/img-upload2";

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
        <Route path="/imgupload" element={<ImgUploa2 />} />
      </Routes>
    </div>
  );
};

export default App;
