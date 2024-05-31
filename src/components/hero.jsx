import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero_bg h-[86%]">
      <section className="text-gray-600 body-font ">
        <div className="container mx-auto grow flex py-24 max-md:py-12 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-5xl text-3xl mb-4 font-medium text-gray-900">
              ФОТО-КОНСТРУКТОР MOZABRICK
            </h1>
            <p className="mb-8 leading-relaxed text-black text-2xl">
              Собирайте любые свои фотографии из кубиков конструктора!
            </p>
            <Link to={"/img"} className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Купить конструктор
              </button>
            </Link>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src="./heroimg.png"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
