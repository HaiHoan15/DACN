import { NavLink, useLocation } from "react-router-dom";
import CheckBox from "../../../Home/_Components/CheckBox";

export default function AdminHeader() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userSlug = user ? toSlug(user.Fullname || user.FullName || "") : "";
  const userProfilePath = user ? `/nguoi-dung/${userSlug}` : "/dang-nhap";
  const isUserRouteActive = location.pathname.startsWith("/nguoi-dung");

  // ảnh mặc định
  const defaultUserImage = "/images/user.png";
  const userImageSrc =
    user?.UserPicture && user.UserPicture.trim() !== ""
      ? user.UserPicture
      : defaultUserImage;
  const navItems = [
    { name: "Trang chủ", path: "admin" },
    { name: "Quản lý người dùng", path: "./quan-ly-nguoi-dung" },
    { name: "Quản lý sản phẩm", path: "./quan-ly-san-pham" },
  ];
  function toSlug(s) {
    return (s || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

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
            href="/"
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
              <NavLink
                to={userProfilePath}
                className={() =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm transition ${
                    isUserRouteActive
                      ? "bg-blue-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-400"
                  }`
                }
              >
                <img
                  src={userImageSrc}
                  alt="User avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultUserImage;
                  }}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <span className="font-medium">{user.Fullname}</span>
              </NavLink>
              <CheckBox />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
