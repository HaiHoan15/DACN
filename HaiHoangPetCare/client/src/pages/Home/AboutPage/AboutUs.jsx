import React from "react";

export default function AboutUs() {
  return (
    <section
      className="bg-white py-16 px-6 md:px-20 text-gray-700 border-t border-gray-200 dark:bg-gray-800"
      style={{ backgroundImage: "url('/images/background/bg7.png')" }}
    >
      {/* Tiêu đề chính */}
      <div className="text-center mb-14 wow animate__fadeInDown">
        <h2 className="text-4xl font-bold text-blue-600">Về chúng tôi</h2>
        <p className="mt-3 text-lg text-gray-800 max-w-2xl mx-auto">
          <span className="font-bold whitespace-nowrap">
            <span className="text-[#2563EB]">HaiHoan</span>
            <span className="text-[#DD6B20]">PetCare </span>
          </span>
          là nền tảng chăm sóc thú cưng toàn diện, giúp bạn dễ dàng quản lý hồ sơ,
          đặt lịch khám và trò chuyện cùng AI để chăm sóc thú cưng hiệu quả hơn bao giờ hết.
        </p>
      </div>

      {/* sứ mệnh  */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
        {/* Ảnh bên trái */}
        <div className="md:w-1/2 wow animate__fadeInLeft">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/intro-man/intro-man3.jpg"
              alt="Our Mission"
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="md:w-1/2 bg-blue-50 p-8 rounded-2xl shadow-md wow animate__fadeInRight">
          <p className="uppercase text-sm font-semibold text-blue-600 mb-2">
            Sứ mệnh của chúng tôi
          </p>
          <h3 className="text-3xl font-bold text-blue-700 mb-4">
            Khách hàng và thú cưng hạnh phúc hơn mỗi ngày
          </h3>
          <p className="text-gray-800 leading-relaxed">
            Giúp mỗi thú cưng được chăm sóc như một thành viên trong gia đình,
            bằng công nghệ hiện đại và tình yêu thương.
            <br />
            <br />
            Chúng tôi mong muốn mang lại một môi trường nơi con người và thú
            cưng được kết nối bằng công nghệ AI, tạo nên cuộc sống dễ dàng hơn
            và tràn đầy yêu thương.
          </p>
        </div>
      </div>

      {/* Gía trị cốt lõi  */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Nội dung bên trái */}
        <div className="md:w-1/2 bg-orange-50 p-8 rounded-2xl shadow-md wow animate__fadeInLeft">
          <p className="uppercase text-sm font-semibold text-orange-500 mb-2">
            Giá trị cốt lõi
          </p>
          <h3 className="text-3xl font-bold text-orange-600 mb-4">
            Đem lại trải nghiệm tốt nhất cho thú cưng và người nuôi
          </h3>
          <ul className="space-y-2 text-gray-800">
            <li>
              <strong className="text-orange-600">Yêu thương:</strong>&nbsp;
              Xem thú cưng như người bạn thân thiết, không chỉ là vật nuôi.
            </li>
            <li>
              <strong className="text-orange-600">Đồng hành:</strong>&nbsp;
              Luôn lắng nghe và hỗ trợ người nuôi thú cưng mọi lúc.
            </li>
            <li>
              <strong className="text-orange-600">Trí tuệ nhân tạo:</strong>&nbsp;
              Ứng dụng AI để gợi ý và theo dõi sức khỏe thú cưng chính xác hơn.
            </li>
            <li>
              <strong className="text-orange-600">Tiện ích:</strong>&nbsp;
              Tất cả dịch vụ chăm sóc trong một nền tảng duy nhất.
            </li>
          </ul>
        </div>

        {/* Ảnh bên phải */}
        <div className="md:w-1/2 wow animate__fadeInRight">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/intro-man/intro-man4.jpg"
              alt="Our Values"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
