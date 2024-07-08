const Hero = () => {
  return (
    <div className=" h-[90%]">
      <section className="text-gray-600 body-font ">
        <div className="container mx-auto grow flex py-24 max-md:py-12 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 mt:mb-0 items-center text-center max-md:mb-4">
            <h1 className="title-font sm:text-5xl text-2xl mb-4 font-medium text-gray-900">
              Создай свою пиксельную картину, воплоти мечту в реальность
            </h1>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded h-[500px] max-md:h-[270px] mx-auto"
              alt="hero"
              src="./bg.jpeg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
