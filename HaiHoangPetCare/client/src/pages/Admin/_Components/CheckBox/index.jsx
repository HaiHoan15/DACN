//ô chọn checkbox hiển thị menu admin
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import api from "../../../../API/api";

const CheckBox = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  // Khi component mount, lấy user thật từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (!localUser?.User_ID) return;

        const res = await api.get("get_user_by_id.php", {
          params: { id: localUser.User_ID },
        });

        if (res.data && res.data.Fullname) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải user:", error);
      }
    };
    fetchUser();
  }, []);

  //  Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/dang-nhap";
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      name: "Quản lý người dùng",
      path: "/admin/quan-ly-nguoi-dung",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      colorClass: "blue",
    },
    {
      name: "Quản lý lịch khám",
      path: "/admin/quan-ly-lich-kham",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: "purple",
    },
    {
      name: "Quản lý thú cưng",
      path: "/admin/quan-ly-thu-cung",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      ),
      colorClass: "pink",
    },
    {
      name: "Quản lý sản phẩm",
      path: "/admin/quan-ly-san-pham",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
      colorClass: "green",
    },
    {
      name: "Quản lý đơn hàng",
      path: "/admin/quan-ly-don-hang",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
      colorClass: "orange",
    },
    {
      name: "Quản lý tin tức",
      path: "/admin/quan-ly-tin-tuc",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20" className="h-5 w-5">
          <path d="M17 6h3a1 1 0 010 2h-3v7a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h9a1 1 0 110 2H4v10h11V6zM5 8a1 1 0 000 2h7a1 1 0 100-2H5zm0 3a1 1 0 000 2h4a1 1 0 100-2H5z" />
        </svg>
      ),
      colorClass: "grey",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        bgHover: "group-hover:bg-blue-200",
        text: "text-blue-600",
        textHover: "group-hover:text-[#2b6cb0]",
        border: "bg-blue-500",
        hoverBg: "hover:bg-blue-50",
      },
      purple: {
        bg: "bg-purple-100",
        bgHover: "group-hover:bg-purple-200",
        text: "text-purple-600",
        textHover: "group-hover:text-purple-700",
        border: "bg-purple-500",
        hoverBg: "hover:bg-purple-50",
      },
      pink: {
        bg: "bg-pink-100",
        bgHover: "group-hover:bg-pink-200",
        text: "text-pink-600",
        textHover: "group-hover:text-pink-700",
        border: "bg-pink-500",
        hoverBg: "hover:bg-pink-50",
      },
      green: {
        bg: "bg-green-100",
        bgHover: "group-hover:bg-green-200",
        text: "text-green-600",
        textHover: "group-hover:text-green-700",
        border: "bg-green-500",
        hoverBg: "hover:bg-green-50",
      },
      orange: {
        bg: "bg-orange-100",
        bgHover: "group-hover:bg-orange-200",
        text: "text-orange-600",
        textHover: "group-hover:text-orange-700",
        border: "bg-orange-500",
        hoverBg: "hover:bg-orange-50",
      },
      grey: {
        bg: "bg-gray-100",
        bgHover: "group-hover:bg-gray-200",
        text: "text-gray-600",
        textHover: "group-hover:text-gray-700",
        border: "bg-gray-500",
        hoverBg: "hover:bg-gray-50",
      },
    };
    return colors[color];
  };

  return (
    <StyledWrapper ref={menuRef}>
      <div>
        {/* Checkbox toggle */}
        <input
          id="toggleChecker"
          type="checkbox"
          checked={open}
          onChange={() => setOpen(!open)}
        />
        <label id="togglerLable" htmlFor="toggleChecker">
          <div className="checkboxtoggler">
            <div className="line-1" />
            <div className="line-2" />
            <div className="line-3" />
          </div>
        </label>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute right-0 mt-3 z-50">
            <div className="max-w-xs w-64 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_15px_15px_-6px_rgba(0,0,0,0.06)] transition-all duration-300">
              {/* user information */}
              <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-600 flex items-center gap-3">
                <img
                  src={user?.UserPicture || "/images/user.png"}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/user.png";
                  }}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <p className="text-white font-semibold truncate">
                  {user?.Fullname || "Người dùng"}
                </p>
              </div>

              {/* Danh sách tab quản lý */}
              <div className="py-1.5">
                {menuItems.map((item) => {
                  const colors = getColorClasses(item.colorClass);
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`group relative flex items-center w-full px-4 py-2.5 text-sm text-gray-700 ${colors.hoverBg} transition-all duration-200`}
                      onClick={() => setOpen(false)}
                    >
                      <div className={`absolute left-0 top-0 h-full w-1 ${colors.border} rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80`} />
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.bgHover} flex items-center justify-center mr-3 transition-colors duration-200`}>
                        <div className={`${colors.text} ${colors.textHover}`}>
                          {item.icon}
                        </div>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-[#1a365d]">
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })}

                {/* Đăng xuất */}
                <NavLink
                  onClick={handleLogout}
                  className="group relative flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80" />
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="h-5 w-5 text-red-500 group-hover:text-red-600"
                    >
                      <path
                        clipRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-red-600">
                    Đăng xuất
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;

  /* -------- Checkbox icon -------- */
  .checkboxtoggler {
    width: 2.2em;
    display: flex;
    flex-direction: column;
    gap: 0.4em;
    cursor: pointer;
  }

  .line-1,
  .line-2,
  .line-3 {
    background: #df6447;
    height: 0.2em;
    border-radius: 10em;
    transition-duration: 500ms;
  }

  #toggleChecker {
    display: none;
  }

  #toggleChecker:checked + #togglerLable .checkboxtoggler .line-1 {
    transform: rotate(45deg) translateY(0.4em) translateX(0.4em);
  }

  #toggleChecker:checked + #togglerLable .checkboxtoggler .line-2 {
    transform: rotate(-45deg) translateY(0em) translateX(0.1em);
  }

  #toggleChecker:checked + #togglerLable .checkboxtoggler .line-3 {
    transform: scaleX(0);
    transform-origin: left;
  }
`;

export default CheckBox;