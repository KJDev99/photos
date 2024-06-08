import { Link } from "react-router-dom";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { IoClose } from "react-icons/io5";
// import { useState } from "react";
import NavbarTop from "../components/navbar-top";

const Header = () => {
  // const [menuActive, setMenuActive] = useState(true);
  return (
    <header className="text-gray-600 body-font h-[10%]">
      <div className="container mx-auto flex flex-wrap md:flex-row items-center justify-between h-full">
        <Link
          to={"/"}
          className="flex title-font font-medium items-center text-gray-900 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">BRENT_NAME</span>
        </Link>

        <NavbarTop />

        {/* <nav
          className={`max-md:mx-auto flex flex-wrap items-center text-base justify-center max-md:absolute max-md:flex-col max-md:left-1/2 max-md:translate-x-[-50%] max-md:bg-slate-800 max-md:w-4/5 py-5 rounded max-md:text-white max-md:z-50 ${
            !menuActive ? "max-md:top-20" : "max-md:top-[-150px]"
          }`}
        >
          <Link
            to={"/"}
            className="mr-5 max-md:hover:text-slate-500 hover:text-gray-900 uppercase"
          >
            главное меню
          </Link>
          <Link
            to={"/katalog"}
            className="mr-5 max-md:hover:text-slate-500 hover:text-gray-900"
          >
            КАТАЛОГ
          </Link>
          <Link
            to={"/about"}
            className="mr-5 max-md:hover:text-slate-500 hover:text-gray-900"
          >
            О MOZABRICK
          </Link>
          <Link
            to={"/contact"}
            className="mr-5 max-md:hover:text-slate-500 hover:text-gray-900"
          >
            КОНТАКТЫ
          </Link>
        </nav> */}
        {/* <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base  md:mt-0">
          Button
          <svg
            fill="none"
            stroke="currentColor"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button> */}
        {/* {menuActive ? (
          <GiHamburgerMenu
            onClick={() => setMenuActive(!menuActive)}
            className="text-2xl md:hidden"
          />
        ) : (
          <IoClose
          onClick={() => setMenuActive(!menuActive)}
            className="text-2xl md:hidden"
          />
        )} */}
      </div>
    </header>
  );
};

export default Header;
