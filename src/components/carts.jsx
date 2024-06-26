import { Link } from "react-router-dom";
import Cart from "./cart";

const Carts = () => {
  return (
    <section className="text-gray-600 body-font">
      <h2 className="title-font text-3xl font-medium text-gray-900 text-center">
        Какой формат выбрать?
      </h2>
      <div className="container py-24 mx-auto">
        <div className="flex flex-wrap m-4 md:mx-24">
          <Cart />
          <Cart />
          <Cart />
        </div>

        <Link to={"/katalog"} className="flex justify-center">
          <button className="mt-10 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Весь каталог
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Carts;
