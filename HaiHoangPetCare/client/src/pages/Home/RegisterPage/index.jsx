import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";
import Notification from "../_Components/Notification";
import imageCompression from "browser-image-compression";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Fullname: "",
    Email: "",
    Password: "",
    Phone: "",
    Birthday: "",
    UserPicture: "",
    Role: "KH",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  //  Cập nhật input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Giới hạn ký tự cho Fullname
    if (name === "Fullname") {
      const invalidChars = /[^a-zA-ZÀ-ỹ\s]/g; // cho phép tiếng Việt có dấu + khoảng trắng
      if (invalidChars.test(value)) {
        return setAlert({
          type: "warning",
          message: "Họ tên không được chứa ký tự đặc biệt!",
        });
      }
      if (value.length > 30) {
        return setAlert({
          type: "warning",
          message: "Họ tên không được vượt quá 30 ký tự!",
        });
      }
    }

    setForm({ ...form, [name]: value });
  };

  // Nén ảnh trước khi upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      return setAlert({
        type: "warning",
        message: "Ảnh quá lớn! Vui lòng chọn ảnh dưới 3MB.",
      });
    }

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, UserPicture: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
      setAlert({
        type: "error",
        message: "Không thể xử lý ảnh, vui lòng thử lại!",
      });
    }
  };

  //  Gửi dữ liệu đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    // Kiểm tra rỗng
    if (
      !form.Fullname ||
      !form.Email ||
      !form.Password ||
      !confirmPassword ||
      !form.Phone ||
      !form.Birthday
    ) {
      return setAlert({
        type: "warning",
        message: "Vui lòng nhập đầy đủ tất cả thông tin!",
      });
    }

    //  Kiểm tra độ dài & ký tự đặc biệt của tên
    if (form.Fullname.length > 30) {
      return setAlert({
        type: "error",
        message: "Tên không được vượt quá 30 ký tự!",
      });
    }

    if (/[^a-zA-ZÀ-ỹ\s]/.test(form.Fullname)) {
      return setAlert({
        type: "error",
        message: "Tên không được chứa ký tự đặc biệt!",
      });
    }

    //  Kiểm tra mật khẩu
    const pwd = form.Password;
    if (pwd.length < 8)
      return setAlert({
        type: "error",
        message: "Mật khẩu chưa đủ 8 ký tự.",
      });
    if (!/[A-Z]/.test(pwd))
      return setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa.",
      });
    if (!/\d/.test(pwd))
      return setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 1 chữ số.",
      });
    if (!/[^A-Za-z0-9]/.test(pwd))
      return setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt.",
      });
    if (form.Password !== confirmPassword)
      return setAlert({
        type: "error",
        message: "Mật khẩu xác nhận không khớp!",
      });

    try {
      setLoading(true);

      //  Gửi lên backend (đường dẫn PHP)
      const res = await api.post("register.php", form, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        setAlert({
          type: "success",
          message: "Đăng ký thành công! Vui lòng đăng nhập...",
        });
        setTimeout(() => navigate("/dang-nhap"), 1200);
      } else {
        setAlert({
          type: "warning",
          message: res.data.message || "Đăng ký thất bại. Vui lòng thử lại!",
        });
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setAlert({
        type: "error",
        message: "Không thể kết nối đến máy chủ. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  //  Giao diện
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Đăng ký</h1>
          <p className="text-gray-500 text-sm">
            Tạo tài khoản để tham gia cùng{" "}
            <span className="font-bold text-blue-500">HaiHoanPetCare</span> 🐾
          </p>
        </div>

        <Notification type={alert.type} message={alert.message} />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Cột trái */}
          <div className="space-y-4">
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
              {/* <p className="text-xs text-gray-500 mt-1">
                <b>Lưu ý:</b> Tên chỉ <b>TỐI ĐA</b> 30 ký tự.
              </p> */}
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
                  Xác nhận mật khẩu
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

            <p className="text-xs text-gray-500">
              <b>Lưu ý:</b> Mật khẩu phải có <b>ÍT NHẤT</b> 8 ký tự, 1 chữ in hoa,
              1 ký tự đặc biệt và 1 chữ số.
            </p>
          </div>

          {/* Cột phải */}
          <div className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện (tùy chọn)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600"
              />
              {preview && (
                <img
                  src={preview}
                  alt="avatar preview"
                  className="mt-2 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>
          </div>

          {/* Nút đăng ký */}
          <div className="col-span-1 md:col-span-2 flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-50 py-2 rounded-lg font-semibold text-white transition duration-200 ${loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Đang đăng ký...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản?{" "}
          <a href="/dang-nhap" className="text-blue-500 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
