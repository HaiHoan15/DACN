import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import WOW from "wowjs";
import "animate.css";

export default function ServicePage() {
  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  const services = [
    {
      title: "Khám bệnh",
      desc: "Theo dõi sức khỏe và đặt lịch khám trực tuyến cho thú cưng với đội ngũ bác sĩ tận tâm.",
      image:
        "/public/images/intro-man/into-man3.png",
      path: "/nguoi-dung",
    },
    {
      title: "Sản phẩm",
      desc: "Mua sắm các phụ kiện, thức ăn và đồ chơi thú cưng của bạn với hàng chính hãng kèm theo giá ưu đãi.",
      image:
        "/public/images/another/pet-products.jpg",
      path: "/san-pham",
    },
    {
      title: "Tư vấn",
      desc: "Trò chuyện với AI Chatbot hoặc bác sĩ để nhận tư vấn chăm sóc phù hợp cho thú cưng.",
      image:
        "/public/images/another/chatbot.jpg",
      path: "/tu-van",
    },
    {
      title: "Tin tức",
      desc: "Cập nhật mẹo chăm sóc, bài viết và xu hướng nuôi thú cưng của bạn mới nhất mỗi ngày.",
      image:
        "/public/images/another/news.jpg",
      path: "/tin-tuc",
    },
  ];

  return (
    <section style={{ backgroundImage: "url('/images/background/krypton-bg.jpg')" }} className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Tiêu đề */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#2563EB] text-center mb-12 animate__animated animate__fadeInDown">
          Các dịch vụ của chúng tôi
        </h2>

        {/* Cards container */}
        <div className="group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {services.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={`wow animate__animated animate__fadeInUp relative w-72 h-96 rounded-3xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer group-hover:blur-sm group-hover:scale-90 hover:!scale-105 hover:!blur-none`}
            >
              {/* Ảnh nền */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:opacity-90 hover:scale-110"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              ></div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Nội dung */}
              <div className="absolute bottom-0 p-6 text-white z-10">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}
