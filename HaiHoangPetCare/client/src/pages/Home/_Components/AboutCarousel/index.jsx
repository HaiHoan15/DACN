import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import WOW from "wowjs";
import "animate.css";

export default function AboutCarousel() {
    useEffect(() => {
        new WOW.WOW({ live: false }).init();
    }, []);

    return (
        <section className="py-12 md:py-8 bg-white overflow-hidden"style={{ backgroundImage: "url('/images/bg2.png')" }}  >
            <div className="container mx-auto px-6 md:px-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
                    {/* Bên trái */}
                    <div className="md:w-1/2 space-y-6">
                        <div>
                            <p className="text-orange-500 font-semibold animate__animated animate__fadeInUp">
                                Xin giới thiệu
                            </p>
                            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight animate__animated animate__fadeInUp animate__delay-0.5s">
                                <span className="text-blue-600">Nền tảng chăm sóc thú cưng</span> của bạn <br />
                                <span className="text-orange-500">tích hợp AI thông minh</span>
                            </h2>
                        </div>

                        <p className="text-gray-600 text-lg animate__animated animate__fadeInUp animate__delay-1.5s">
                            Giúp bạn theo dõi sức khỏe, lịch khám và trò chuyện cùng AI để chăm
                            sóc thú cưng dễ dàng và hiệu quả hơn bao giờ hết.
                        </p>

                        <ul className="space-y-3 text-gray-700 animate__animated animate__fadeInUp animate__delay-1.5s">
                            <li className="flex items-center gap-2">
                                <span className="text-blue-600 text-xl">✔</span>
                                Theo dõi sức khỏe và lịch khám
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-orange-500 text-xl">✔</span>
                                Chatbot AI hỗ trợ tư vấn 24/7
                            </li>
                        </ul>

                        <NavLink
                            to="/"
                            className="mt-4 inline-flex items-center justify-center px-8 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-blue-600 to-orange-400 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1 transform transition duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-orange-200 animate__animated animate__fadeInUp animate__delay-1.75s"
                        >
                            BẮT ĐẦU NGAY
                        </NavLink>
                    </div>

                    {/* Hình ảnh bên phải */}
                    <div className="md:w-1/3 flex justify-center animate__animated animate__fadeInRight animate__delay-1.75s">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-blue-500 rounded-[30px] blur-2xl opacity-70"></div>
                            <img
                                src="/images/intro-man2.png"
                                alt="Bác sĩ thú cưng"
                                className="relative rounded-[30px] w-[300px] md:w-[420px] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
