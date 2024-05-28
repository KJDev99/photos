import About from "../components/about";
import Footer from "../components/footer";
import Header from "../components/header";
import NavbarTop from "../components/navbar-top";
import Teams from "../components/teams";

const AboutPage = () => {
  return (
    <div>
      <NavbarTop />
      <Header />
      <About />
      <Teams />
      <Footer />
    </div>
  );
};

export default AboutPage;
