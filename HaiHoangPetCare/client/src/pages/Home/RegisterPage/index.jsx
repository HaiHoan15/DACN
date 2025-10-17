import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";

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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.Password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await api.post("/USER", form);
      // alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/dang-nhap");
    } catch (err) {
      console.error(err);
      setError("Đăng ký thất bại. Vui lòng thử lại!");
    }
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
