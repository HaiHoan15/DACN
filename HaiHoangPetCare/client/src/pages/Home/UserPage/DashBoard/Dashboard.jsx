import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading"

export default function Dashboard({ activeTab, onSelectTab }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const res = await api.get("/USER", {
          params: { User_ID: userData.User_ID },
        });
        const latestUser =
          Array.isArray(res.data) && res.data.length > 0
            ? res.data[0]
            : res.data;

        if (latestUser && latestUser.Fullname !== userData.Fullname) {
          setUser(latestUser);
          localStorage.setItem("user", JSON.stringify(latestUser));
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu user:", err);
        setError("Không thể tải thông tin người dùng");
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng</div>;

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col items-center py-6">
      {/* Avatar + Name */}
      <div className="flex flex-col mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3">
          {user?.UserPicture ? (
            <img
              src={user.UserPicture}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user.png"; // ảnh mặc định khi lỗi
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <i className="fa-solid fa-user text-gray-400 text-4xl"></i>
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold">{user?.Fullname || "Không xác định"}</h2>
        <p className="text-sm text-gray-500">{user?.Email}</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-4 w-full px-8 text-gray-700">
        <button
          onClick={() => onSelectTab("profile")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${activeTab === "profile" ? "text-blue-600 font-semibold" : ""
            }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-id-card"></i>
          </span>
          <span>Hồ sơ</span>
        </button>
        <button
          onClick={() => onSelectTab("pet")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${activeTab === "pet" ? "text-blue-600 font-semibold" : ""
            }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-paw"></i>
          </span>
          <span>Thú cưng</span>
        </button>

        <button
          onClick={() => onSelectTab("schedule")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${activeTab === "schedule" ? "text-blue-600 font-semibold" : ""
            }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-regular fa-calendar-check"></i>
          </span>
          <span>Lịch khám</span>
        </button>

        <button
          onClick={() => onSelectTab("wishlist")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${activeTab === "wishlist" ? "text-blue-600 font-semibold" : ""
            }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-cart-shopping"></i>
          </span>
          <span>Giỏ hàng</span>
        </button>

        <button
          onClick={() => onSelectTab("order")}
          className={`flex items-center gap-3 text-left hover:text-blue-600 ${activeTab === "order" ? "text-blue-600 font-semibold" : ""
            }`}
        >
          <span className="w-6 flex items-center justify-center text-lg text-gray-600">
            <i className="fa-solid fa-box-open"></i>
          </span>
          <span>Đơn hàng</span>
        </button>
      </nav>

    </div>
  );
}