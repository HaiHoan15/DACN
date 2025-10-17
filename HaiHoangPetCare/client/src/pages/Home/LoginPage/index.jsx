import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.get(`/USER?Email=${form.email}`);
      const user = res.data[0];

      if (!user) return setError("Email không tồn tại");
      if (user.Password !== form.password) return setError("Sai mật khẩu");

      localStorage.setItem("user", JSON.stringify(user));

      // alert("Đăng nhập thành công!");

      if (user.Role === "BS") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi đăng nhập, vui lòng thử lại!");
    }
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
