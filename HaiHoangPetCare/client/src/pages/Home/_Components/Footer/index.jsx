import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="p-6 bg-white border-t border-gray-200 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl">
        <div className="md:flex md:justify-between md:items-start">
          {/* Logo + mô tả */}
          <div className="mb-6 md:mb-0 flex-1">
            <a href="/" className="flex items-center">
              <img src="/images/logo.png" className="mr-3 h-10" alt="HaiHoanPetCare Logo" />
              <span className="self-center text-2xl font-bold whitespace-nowrap">
                <span className="text-[#2563EB]">HaiHoan</span>
                <span className="text-[#DD6B20]">PetCare</span>
              </span>
            </a>
            <p className="mt-3 text-gray-600 text-sm max-w-sm leading-relaxed">
              Nền tảng chăm sóc thú cưng thông minh giúp bạn quản lý hồ sơ, đặt lịch khám,
              mua sắm phụ kiện và nhận tư vấn trực tuyến từ AI & bác sĩ thú y.
            </p>
          </div>

          {/* Các nhóm liên kết */}
          <div className="grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-3">
            {/* Danh mục */}
            <div>
              <h2 className="mb-4 text-sm font-semibold text-[#2563EB] uppercase">
                Danh mục
              </h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><NavLink to="/" className="hover:text-[#DD6B20] transition">Trang chủ</NavLink></li>
                <li><a href="/gioi-thieu" className="hover:text-[#DD6B20] transition">Giới thiệu</a></li>
                <li><a href="/san-pham" className="hover:text-[#DD6B20] transition">Sản phẩm</a></li>
                <li><a href="/tu-van" className="hover:text-[#DD6B20] transition">Tư vấn</a></li>
                <li><a href="/tin-tuc" className="hover:text-[#DD6B20] transition">Tin tức</a></li>
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h2 className="mb-4 text-sm font-semibold text-[#2563EB] uppercase">
                Hỗ trợ
              </h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><a href="/" className="hover:text-[#DD6B20] transition">Liên hệ</a></li>
                <li><a href="/" className="hover:text-[#DD6B20] transition">Chính sách & Bảo mật</a></li>
                <li><a href="/" className="hover:text-[#DD6B20] transition">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            {/* Kết nối */}
            <div>
              <h2 className="mb-4 text-sm font-semibold text-[#2563EB] uppercase">
                Kết nối
              </h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><a href="https://facebook.com" className="hover:text-[#DD6B20] transition">Facebook</a></li>
                <li><a href="https://instagram.com" className="hover:text-[#DD6B20] transition">Instagram</a></li>
                <li><a href="https://tiktok.com" className="hover:text-[#DD6B20] transition">TikTok</a></li>
                <li><a href="mailto:support@haihoanpetcare.online" className="hover:text-[#DD6B20] transition">Email</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Đường kẻ chia + phần bản quyền */}
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a href="/" className="hover:text-[#2563EB] font-medium">
              HaiHoanPetCare
            </a>. All rights reserved.
          </span>

          {/* Mạng xã hội với icon SVG */}
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a href="https://facebook.com" className="text-gray-500 hover:text-[#2563EB]">
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="https://instagram.com" className="text-gray-500 hover:text-[#DD6B20]">
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a href="https://tiktok.com" className="text-gray-500 hover:text-[#2563EB]">
              <i className="fab fa-tiktok text-lg"></i>
            </a>
            <a href="mailto:support@haihoanpetcare.online" className="text-gray-500 hover:text-[#DD6B20]">
              <i className="fas fa-envelope text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

