import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading";

export default function Dashboard({ activeTab, onSelectTab }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Chưa đăng nhập");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);

        const res = await api.get("get_user_by_id.php", {
          params: { id: userData.User_ID },
        });

        if (res.data && res.data.Fullname) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu user:", err);
        setError("Không thể tải thông tin người dùng");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/dang-nhap");
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng</div>;

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col items-start py-6">
      
      {/* Avatar + Name */}
      <div className="flex flex-col mb-6 px-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center">
          {user?.UserPicture ? (
            <img
              src={user.UserPicture}
              alt="Avatar"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user.png";
              }}
            />
          ) : (
            <i className="fa-solid fa-user text-gray-400 text-4xl"></i>
          )}
        </div>

        <h2 className="text-lg font-semibold break-words max-w-[10rem]">
          {user?.Fullname || "Không xác định"}
        </h2>

        <p className="text-sm text-gray-500 break-words max-w-[10rem]">
          {user?.Email}
        </p>

        <p className="text-xs text-blue-600 font-medium mt-1">Admin</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-4 w-full px-8 text-gray-700">

        <button
          onClick={() => onSelectTab("profile")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${
            activeTab === "profile" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-id-card"></i>
          </span>
          <span>Hồ sơ</span>
        </button>

        <button
          onClick={() => onSelectTab("schedule")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${
            activeTab === "schedule" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-regular fa-calendar-check"></i>
          </span>
          <span>Lịch khám</span>
        </button>

        <button
          onClick={() => onSelectTab("order")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${
            activeTab === "order" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-box-open"></i>
          </span>
          <span>Đơn hàng</span>
        </button>

        <button
          onClick={() => onSelectTab("statistics")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${
            activeTab === "statistics" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-chart-line"></i>
          </span>
          <span>Thống kê</span>
        </button>

        <button
          onClick={() => onSelectTab("chatbot")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${
            activeTab === "chatbot" ? "text-blue-600 font-semibold" : ""
          }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-robot"></i>
          </span>
          <span>AI ChatBot</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-left hover:text-red-600 mt-4 border-t pt-4"
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span>Đăng xuất</span>
        </button>

      </nav>
    </div>
  );
}
