import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";

function Header() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("succesToken");

  const handleLogout = () => {
    setShowModal(false);
    sessionStorage.clear();
    navigate("/");
  };

  const handleIconClick = () => {
    if (location.pathname === "/getpdf") {
      setShowModal(true);
    }
  };

  return (
    <header className="text-gray-600 body-font h-[10%] mt-6 print">
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

        {token ? (
          location.pathname === "/getpdf" ? (
            <button onClick={handleIconClick} className="flex items-center">
              <IoExitOutline className="text-4xl" />
            </button>
          ) : (
            <Link to="/getpdf" className="flex items-center">
              <MdOutlinePictureAsPdf className="text-4xl" />
            </Link>
          )
        ) : (
          ""
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Вы действительно хотите выйти?</h2>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Да
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
