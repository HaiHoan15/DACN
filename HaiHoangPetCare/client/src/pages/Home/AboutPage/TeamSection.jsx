import React from "react";

export default function TeamSection() {
    const team = [
        {
            name: "Nguyễn Hải Hoàng",
            role: "Nhà phát triển & Sáng lập HaiHoanPetCare",
            image: "/images/intro-man/IT.jpg",
            desc: "Sinh viên CNTT với đam mê ứng dụng công nghệ AI vào lĩnh vực chăm sóc thú cưng, hướng tới giải pháp số hóa thân thiện và hiệu quả.",
        },
        {
            name: "Bác sĩ Thu Hà",
            role: "Bác sĩ thú y cố vấn",
            image: "/images/intro-man/doctor1.jpg",
            desc: "Hơn 10 năm kinh nghiệm trong lĩnh vực thú y, tận tâm đồng hành cùng HaiHoanPetCare để mang đến sự chăm sóc tốt nhất cho thú cưng.",
        },
        {
            name: "Bác sĩ Minh Khang",
            role: "Chuyên gia dinh dưỡng thú cưng",
            image: "/images/intro-man/doctor2.jpg",
            desc: "Cung cấp kiến thức dinh dưỡng và phác đồ điều trị phù hợp, giúp thú cưng luôn khỏe mạnh và tràn đầy năng lượng.",
        },
    ];

    return (
        <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white to-blue-50 text-center border-t border-gray-200 dark:bg-gray-800"
        style={{ backgroundImage: "url('/images/background/bg2.png')" }} >
            {/* Tiêu đề */}
            <div className="mb-14">
                <h2 className="text-4xl font-bold text-blue-600 mb-3">
                    Đội ngũ phát triển
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Những người đứng sau <span className="font-bold text-[#2563EB]">HaiHoan</span>
                    <span className="font-bold text-[#DD6B20]">PetCare</span> – những con người
                    tận tâm mang đến nền tảng chăm sóc thú cưng thông minh và gần gũi.
                </p>
            </div>

            {/* Lưới đội ngũ */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {team.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-500 transform hover:-translate-y-2 p-6"
                    >
                        {/* Ảnh thành viên */}
                        <div className="relative w-36 h-36 mx-auto mb-5">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-md"
                            />
                        </div>

                        {/* Thông tin */}
                        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{member.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
