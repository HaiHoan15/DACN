import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";
import {
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Fullname: "",
    Email: "",
    Password: "",
    Phone: "",
    Birthday: "",
    Role: "KH",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    // Kiểm tra nhập đầy đủ thông tin
    if (
      !form.Fullname ||
      !form.Email ||
      !form.Password ||
      !form.Phone ||
      !form.Birthday
    ) {
      return setAlert({
        type: "warning",
        message: "Vui lòng nhập đầy đủ tất cả thông tin!",
      });
    }

    // Kiểm tra độ mạnh mật khẩu
    const pwd = form.Password || "";

    if (pwd.length < 8) {
      return setAlert({
        type: "error",
        message: "Mật khẩu chưa đủ 8 ký tự.",
      });
    }
    if (!/[A-Z]/.test(pwd)) {
      return setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa.",
      });
    }
    if (!/\d/.test(pwd)) {
      return setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 1 chữ số.",
      });
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt.",
      });
    }

    // Kiểm tra khớp mật khẩu
    if (form.Password !== confirmPassword) {
      return setAlert({
        type: "error",
        message: "Mật khẩu xác nhận không khớp!",
      });
    }

    // hợp lệ → gửi API
    try {
      await api.post("/USER", form);
      setAlert({
        type: "success",
        message: "Đăng ký thành công! Vui lòng đăng nhập.",
      });

      // Chờ 1.2s rồi chuyển sang trang đăng nhập
      setTimeout(() => navigate("/dang-nhap"), 1200);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "warning",
        message: "Đăng ký thất bại. Vui lòng thử lại!",
      });
    }
  };

  // Component hiển thị alert
  const renderAlert = () => {
    if (!alert.message) return null;

    const styles = {
      success:
        "bg-green-50 text-green-800 border border-green-300 dark:bg-gray-800 dark:text-green-400",
      error:
        "bg-red-50 text-red-800 border border-red-300 dark:bg-gray-800 dark:text-red-400",
      warning:
        "bg-yellow-50 text-yellow-800 border border-yellow-300 dark:bg-gray-800 dark:text-yellow-300",
    };

    const icons = {
      success: <CheckCircleIcon className="w-5 h-5 mr-2" />,
      error: <XCircleIcon className="w-5 h-5 mr-2" />,
      warning: <ExclamationTriangleIcon className="w-5 h-5 mr-2" />,
    };

    return (
      <div
        className={`flex items-center p-4 mb-4 text-sm rounded-lg ${styles[alert.type]}`}
        role="alert"
      >
        {icons[alert.type]}
        <span className="font-medium">{alert.message}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-blue-500">Đăng ký</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Tạo tài khoản để tham gia cùng{" "}
            <span className="font-bold text-blue-500">HaiHoanPetCare</span> 🐾
          </p>
        </div>

        {renderAlert()}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="Fullname"
              value={form.Fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên..."
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Nhập email..."
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="Password"
                value={form.Password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="Phone"
              value={form.Phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="Birthday"
              value={form.Birthday}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a href="/dang-nhap" className="text-blue-500 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
