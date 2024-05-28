import Footer from "../components/footer";
import Header from "../components/header";
import ImgUpload from "../components/imp-upload";
import NavbarTop from "../components/navbar-top";
import "../App.css";
const ImgPage = () => {
  return (
    <div className="wrapper">
      <NavbarTop />
      <Header />
      <ImgUpload />
      <Footer />
    </div>
  );
};

export default ImgPage;
