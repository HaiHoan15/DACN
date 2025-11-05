import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import api from "../../../../API/api";

const Checkbox = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  // Khi component mount, lấy user thật từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (!localUser?.User_ID) return;

        const res = await api.get("/USER", {
          params: { User_ID: localUser.User_ID },
        });

        const userData = Array.isArray(res.data) ? res.data[0] : res.data;
        setUser(userData);
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
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <p className="text-white font-semibold truncate">
                  {user?.Fullname || "Người dùng"}
                </p>
              </div>

              {/* Danh sách tab */}
              <div className="py-1.5">
                {/* Thông tin chi tiết */}
                <NavLink
                  to="nguoi-dung"
                  className="group relative flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80" />
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="h-5 w-5 text-blue-600 group-hover:text-[#2b6cb0]"
                    >
                      <path
                        clipRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-[#1a365d]">
                    Thông tin chi tiết
                  </span>
                </NavLink>

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

  /* -------- Dropdown -------- */
  .dropdown {
    position: absolute;
    right: 0;
    top: 3.5em;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 220px;
    z-index: 100;
    animation: fadeIn 0.2s ease-in-out;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.6em;
    padding: 0.8em 1em;
    border-bottom: 1px solid #eee;
  }

  .user-info img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info span {
    font-weight: 600;
    color: #222;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ul li {
    padding: 0.6em 1em;
    cursor: pointer;
    color: #333;
    transition: background 0.2s;
  }

  ul li:hover {
    background: #f5f5f5;
  }

  ul li.logout {
    color: #df6447;
    font-weight: 500;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default Checkbox;
