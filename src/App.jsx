import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import KatalogPage from "./pages/katalog-page";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/katalog" element={<KatalogPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};

export default App;
