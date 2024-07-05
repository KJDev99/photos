import { Link } from "react-router-dom";

function Header({ isAuthenticated, onLogout }) {
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

        {/* {isAuthenticated ? (
          <div className="flex items-center">
            <span className="text-gray-900 mr-4">Hello</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-5 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="bg-indigo-500 text-white px-5 py-2 rounded">
              Login
            </button>
          </Link>
        )} */}
      </div>
    </header>
  );
}

export default Header;
