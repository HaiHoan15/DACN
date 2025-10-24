import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    try {
      const res = await api.get(`/USER?Email=${form.email}`);
      const user = res.data[0];

      if (!user)
        return setAlert({ type: "error", message: "Email không tồn tại!" });
      if (user.Password !== form.password)
        return setAlert({ type: "error", message: "Sai mật khẩu!" });

      localStorage.setItem("user", JSON.stringify(user));
      setAlert({ type: "success", message: "Đăng nhập thành công!" });

      setTimeout(() => {
        if (user.Role === "BS") navigate("/admin");
        else navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "warning",
        message: "Lỗi đăng nhập, vui lòng thử lại!",
      });
    }
  };

  // Component hiển thị thông báo 
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-orange-500">Đăng nhập</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Chào mừng bạn đến với{" "}
            <span className="font-bold text-orange-500">HaiHoanPetCare</span> 🐾
          </p>
        </div>

        {renderAlert()}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email..."
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu..."
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <a href="/dang-ky" className="text-orange-500 hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
