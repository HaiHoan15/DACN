import React from "react";
import { NavLink } from "react-router-dom";

export default function Banner() {
  const handleExploreClick = () => {
    console.log("Khám phá ngay được nhấn!");
   
  };

  return (
    <section
      className="relative w-full h-[90vh] flex items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background2.jpg')" }} 
    >
      {/* Overlay gradient mờ */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/90 via-[#2563EB]/70 to-transparent"></div> */}

      {/* Nội dung */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 text-white max-w-3xl">
        <p className="text-[#DD6B20] text-lg md:text-xl font-semibold mb-2 animate__animated animate__fadeInUp">
          Xin chào mừng bạn đến với
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate__animated animate__fadeInUp animate__delay-0.5s">
          <span className="text-[#2563EB]">HaiHoan</span>
          <span className="text-[#DD6B20]">PetCare</span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-black/100 mb-6 animate__animated animate__fadeInUp animate__delay-0.5s">
          Nền tảng chăm sóc thú cưng thông minh<br />với AI & bác sĩ thú y hàng đầu
        </h2>

        <p className="text-lg text-black/100 mb-8 animate__animated animate__fadeInUp animate__delay-0.5s">
          Theo dõi sức khỏe, đặt lịch khám và trò chuyện với AI để chăm sóc thú
          cưng của bạn dễ dàng hơn bao giờ hết.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate__animated animate__fadeInUp animate__delay-1.5s">
          <NavLink to={"/"}
            onClick={handleExploreClick}
            className="px-8 py-3 bg-[#DD6B20] text-white font-semibold rounded-full shadow-md hover:bg-[#c45d1b] hover:shadow-lg transition duration-300"
          >
            BẮT ĐẦU NGAY
          </NavLink>
          <NavLink to={"/gioi-thieu"}
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#2563EB] transition duration-300"
          >
            TÌM HIỂU THÊM
          </NavLink>
        </div>
      </div>
    </section>
  );
}
