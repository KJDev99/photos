import { Link } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";

function Header({ isAuthenticated }) {
  return (
    <header className="text-gray-600 body-font h-[10%] mt-6">
      <div className="container mx-auto flex flex-wrap md:flex-row items-center justify-between h-full">
        <Link
          to="/"
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
          <span className="ml-3 text-xl">PixelArt</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center">
            <IoPersonCircleOutline className="text-4xl" />
          </div>
        ) : (
          ""
        )}
      </div>
    </header>
  );
}

export default Header;
