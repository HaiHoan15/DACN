import React from "react";

export default function ContactSection() {
    return (
        <section
            className="py-20 px-6 md:px-20 text-center text-gray-700 relative border-t border-gray-200 dark:bg-gray-800"
            style={{
                backgroundImage: "url('/images/background/contact-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="relative z-10">
                {/* Tiêu đề */}
                <h2 className="text-4xl font-bold text-blue-600 mb-3">
                    Liên hệ với chúng tôi
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-10">
                    Hãy để <span className="text-[#2563EB] font-semibold">HaiHoan</span>
                    <span className="text-[#DD6B20] font-semibold">PetCare</span> đồng hành cùng bạn
                    trong hành trình chăm sóc thú cưng yêu quý của mình 💖
                </p>

                {/* Form liên hệ */}
                <form className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Họ tên */}
                        <div>
                            <label className="block text-left text-sm font-semibold text-blue-700 mb-1">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập họ tên của bạn"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-400 outline-none transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-left text-sm font-semibold text-blue-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-400 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Nội dung tin nhắn */}
                    <div className="mt-6">
                        <label className="block text-left text-sm font-semibold text-blue-700 mb-1">
                            Nội dung tin nhắn
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Bạn muốn gửi lời nhắn gì đến HaiHoanPetCare?"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-400 outline-none resize-none transition"
                        ></textarea>
                    </div>

                    {/* Nút gửi */}
                    <button
                        type="button"
                        className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
                    >
                        GỬI NGAY
                    </button>
                </form>
            </div>
        </section>
    );
}
