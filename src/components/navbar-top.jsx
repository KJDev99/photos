const NavbarTop = () => {
  return (
    // <div className="max-md:hidden">
    <div className="flex justify-center">
      <a className="flex mx-4">
        <img src="./adress.svg" alt="email" />
        <p className="ml-3 text-[14px] text-[rgba(0,0,0,0.6)] max-md:hidden">
          Abdulla qodiry ko’chasi, 12A uy
        </p>
      </a>
      <a href="mailto:johndoe@gmail.com" className="flex mx-4">
        <img src="./email.svg" alt="email" />
        <p className="ml-3 text-[14px] text-[rgba(0,0,0,0.6)] max-md:hidden">
          johndoe@gmail.com
        </p>
      </a>
      <a href="tel:+998911111111" className="flex mx-4">
        <img src="./phone.svg" alt="email" />
        <p className="ml-3 text-[14px] text-[rgba(0,0,0,0.6)] max-md:hidden">
          +998 11 111-11-11
        </p>
      </a>
    </div>
    // </div>
  );
};

export default NavbarTop;
