import { NavLink } from "react-router-dom";
import CheckBox from "../CheckBox";
import NofiticationBell from "../NotificationBell";

export default function AdminHeader() {
 
  const user = JSON.parse(localStorage.getItem("user"));

  // ảnh mặc định
  const defaultUserImage = "/images/user.png";
  const userImageSrc =
    user?.UserPicture && user.UserPicture.trim() !== ""
      ? user.UserPicture
      : defaultUserImage;
  const navItems = [
    { name: "Trang chủ", path: "/admin", end: true },
    { name: "Người dùng", path: "./quan-ly-nguoi-dung" },
    { name: "Lịch khám", path: "./quan-ly-lich-kham" },
    { name: "Thú cưng", path: "./quan-ly-thu-cung" },
    { name: "Sản phẩm", path: "./quan-ly-san-pham" },
    { name: "Đơn hàng", path: "./quan-ly-don-hang" },
    { name: "Tin tức", path: "./quan-ly-tin-tuc" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Tên web */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="HaiHoanPetCare Logo"
            className="w-12 h-12 object-contain"
          />
          <a
            href="/admin"
            className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            HaiHoan<span className="text-orange-500">PetCare</span>
          </a>
        </div>

        {/* menu điều hướng trong admin */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `text-gray-700 font-medium hover:text-blue-600 transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        {/* Khu vực user */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <NavLink
                to="/dang-nhap"
                className="text-gray-700 hover:text-orange-500 font-medium"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/dang-ky"
                className="bg-gray-700 text-white px-4 py-1.5 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Đăng ký
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm bg-blue-400 text-gray-700">
                <img
                  src={userImageSrc}
                  alt="User avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/user.png";
                  }}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <span className="font-medium">{user.Fullname}</span>
              </div>
              <CheckBox />
              <NofiticationBell />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
