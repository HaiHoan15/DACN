import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  // Xác định đường dẫn trang cá nhân và trạng thái active
  const userSlug = user ? toSlug(user.Fullname || user.FullName || "") : "";
  const userProfilePath = user ? `/nguoi-dung/${userSlug}` : "/dang-nhap";
  const isUserRouteActive = location.pathname.startsWith("/nguoi-dung");
  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "./gioi-thieu" },
    { name: "Dịch vụ", path: "./dich-vu" },
    { name: "Sản phẩm", path: "./san-pham" },
    { name: "Tư vấn", path: "./tu-van" },
    { name: "Tin tức", path: "./tin-tuc" },
  ];
  //  Xử lý ảnh đại diện trống
  const defaultUserImage = "/images/user.png";
  const userImageSrc =
    user?.UserPicture && user.UserPicture.trim() !== ""
      ? user.UserPicture
      : defaultUserImage;

  //  Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/dang-nhap");
  };

  // xửa lý chuyển tên user thành slug
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
            HaiHoan<span className="text-orange-500 ">PetCare</span>
          </a>
        </div>

        {/* Menu chính */}
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

        {/*  đăng nhập / đăng ký */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              {/* Chưa đăng nhập */}
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
            <>
              {/* Đã đăng nhập */}
              <div className="flex items-center gap-3">
                {/* Avatar + tên user */}
                <NavLink
                  to={userProfilePath}
                  className={() =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm transition ${isUserRouteActive
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

                {/* Nút Đăng xuất */}
                <NavLink
                  to="/dang-nhap"
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-lg hover:w-36 hover:rounded-full active:translate-x-1 active:translate-y-1"
                >
                  <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                    <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-base font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    Đăng xuất
                  </div>
                </NavLink>
              </div>

            </>
          )}
        </div>
      </div>
    </header>
  );
}
