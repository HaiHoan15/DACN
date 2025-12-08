import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../../../API/api";

const NotificationBox = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({ total: 0, items: [], pendingOrders: 0, pendingAppointments: 0 });
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // Tự động làm mới mỗi 30 giây
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("get_admin_notifications.php");
      if (res.data && !res.data.error) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // phút
    
    if (diff < 1) return "Vừa xong";
    if (diff < 60) return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleNotificationClick = (link) => {
    setOpen(false);
    if (link) {
      const tab = link.split('tab=')[1];
      if (tab) {
        navigate(`/admin?tab=${tab}`);
      }
    }
  };

  //  Đóng dropdown khi click ra ngoài
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
      <input
        id="notifChecker"
        type="checkbox"
        checked={open}
        onChange={() => setOpen(!open)}
      />
      <label id="notifLabel" htmlFor="notifChecker">
        <div className="notifIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="bell"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
          </svg>

          {notifications.total > 0 && (
            <span className="badge">{notifications.total}</span>
          )}
        </div>
      </label>

      {open && (
        <div className="absolute right-0 mt-3 z-50">
          <div className="max-w-xs w-80 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_15px_15px_-6px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-between">
              <p className="text-white font-semibold">Thông báo Admin</p>
              <span className="text-xs text-white opacity-90">
                {notifications.total} mới
              </span>
            </div>
            
            {/* Tóm tắt */}
            <div className="px-4 py-3 bg-gray-50 border-b grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-xs text-gray-500">Đơn hàng</p>
                  <p className="font-bold text-orange-600">{notifications.pendingOrders}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-gray-500">Lịch khám</p>
                  <p className="font-bold text-blue-600">{notifications.pendingAppointments}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {notifications.items && notifications.items.length > 0 ? (
                notifications.items.map((n, index) => (
                  <div
                    key={index}
                    onClick={() => handleNotificationClick(n.link)}
                    className="p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl mt-0.5">
                        {n.type === 'order' ? '📦' : '📅'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(n.time)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center p-4 text-gray-500 text-sm">
                  Không có thông báo mới
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;

  /* Icon container có cùng kích thước với .checkboxtoggler */
  .notifIcon {
    width: 2.2em;
    height: 2.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: transform 0.3s ease;
  }

  .bell {
    width: 1.7em;
    height: 1.7em;
    fill: #df6447; /* Màu đồng bộ với menu user */
    transition: transform 0.3s ease;
  }

  #notifChecker {
    display: none;
  }

  /* Hiệu ứng khi bật */
  #notifChecker:checked + #notifLabel .notifIcon .bell {
    transform: rotate(-15deg) scale(1.1);
  }

  .badge {
    position: absolute;
    top: 0;
    right: -2px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 1.2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export default NotificationBox;
