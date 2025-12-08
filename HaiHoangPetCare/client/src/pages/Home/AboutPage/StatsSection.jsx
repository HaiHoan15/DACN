import React from "react";

export default function StatsSection() {
  const stats = [
    {
      number: "15",
      label: "Chi nhánh toàn quốc",
      desc: "Mạng lưới phòng khám thú cưng rộng khắp, giúp khách hàng dễ dàng tiếp cận dịch vụ.",
      color: "from-blue-500 to-blue-400",
    },
    {
      number: "35",
      label: "Bác sĩ thú y",
      desc: "Đội ngũ bác sĩ tận tâm, giàu kinh nghiệm và được đào tạo một cách chuyên sâu.",
      color: "from-orange-500 to-orange-400",
    },
    {
      number: "3.2k",
      label: "Thú cưng được khám",
      desc: "Chúng tôi tự hào đã đồng hành và chăm sóc cho hàng nghìn thú cưng khỏe mạnh.",
      color: "from-green-500 to-green-400",
    },
    {
      number: "4.9/5",
      label: "Đánh giá khách hàng",
      desc: "Mức độ hài lòng cao từ cộng đồng yêu thú cưng trên khắp Việt Nam.",
      color: "from-pink-500 to-pink-400",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-20 text-center border-t border-gray-200 dark:bg-gray-800" 
    style={{ backgroundImage: "url('/images/background/bg3.png')" }} >
      {/* Tiêu đề */}
      <div className="mb-14">
        <h2 className="text-4xl font-bold text-blue-600 mb-3">
          Số liệu thống kê
        </h2>
        <p className="mt-3 text-lg text-gray-800 max-w-2xl mx-auto">
          Những con số ấn tượng thể hiện sự tin tưởng của khách hàng dành cho{" "}
          <span className="font-bold text-[#2563EB]">HaiHoan</span>
          <span className="font-bold text-[#DD6B20]">PetCare</span>.
        </p>
      </div>

      {/* Grid thống kê */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transform transition duration-500"
          >
            {/* Vòng tròn số liệu */}
            <div
              className={`mx-auto w-28 h-28 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl font-extrabold mb-5`}
            >
              {item.number}
            </div>

            {/* Tiêu đề & mô tả */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {item.label}
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
