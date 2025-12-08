import React, { useEffect, useState } from "react";
import api from "../../../../API/api";
import Notification from "../../../Admin/_Components/Notification";
import Loading from "../../../Admin/_Components/Loading";
import imageCompression from "browser-image-compression";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [inputErrors, setInputErrors] = useState({
    Fullname: "",
    Address: "",
    Phone: "",
  });

  const [imageChanged, setImageChanged] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (!localUser) {
        setAlert({ type: "error", message: "Vui lòng đăng nhập!" });
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("get_user_by_id.php", {
          params: { id: localUser.User_ID },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi tải user:", err);
        setAlert({ type: "error", message: "Không thể tải thông tin người dùng." });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["Fullname", "Address", "Phone"].includes(name)) {
      const error = validateInput(name, value);
      setInputErrors((prev) => ({ ...prev, [name]: error }));
    }

    setUser((prev) => ({ ...prev, [name]: value }));

    if (name === "Email") setEmailError("");
  };

  const validateInput = (name, value) => {
    const regex = /^[\p{L}\p{N}\s]+$/u;

    if (value.length > 30) {
      return "Tối đa 30 ký tự.";
    }

    if (!regex.test(value)) {
      return "Không được chứa ký tự đặc biệt.";
    }

    return "";
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64 = await convertToBase64(compressedFile);
      setUser((prev) => ({ ...prev, UserPicture: base64 }));
      setImageChanged(true);
    } catch (err) {
      console.error("Lỗi xử lý hình:", err);
      setAlert({ type: "error", message: "Không thể xử lý ảnh, vui lòng thử lại." });
    }
  };

  const validatePassword = () => {
    const pwd = passwordData.NewPassword;
    const confirm = passwordData.ConfirmPassword;
    if (!pwd && !confirm) return null;
    if (pwd.length < 8) return "Mật khẩu chưa đủ 8 ký tự.";
    if (!/[A-Z]/.test(pwd)) return "Mật khẩu phải có ít nhất 1 chữ cái in hoa.";
    if (!/\d/.test(pwd)) return "Mật khẩu phải có ít nhất 1 chữ số.";
    if (!/[^A-Za-z0-9]/.test(pwd))
      return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt.";
    if (pwd !== confirm) return "Mật khẩu xác nhận không khớp!";
    if (!passwordData.CurrentPassword)
      return "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu.";
    return null;
  };

  const checkDuplicateEmail = async () => {
    try {
      const res = await api.get("get_all_users.php");
      if (!Array.isArray(res.data)) return false;
      const duplicate = res.data.some(
        (u) => u.Email === user.Email && String(u.User_ID) !== String(user.User_ID)
      );
      return duplicate;
    } catch (err) {
      console.error("Không thể kiểm tra email:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setEmailError("");
    setAlert({ type: "", message: "" });

    const pwdError = validatePassword();
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    const duplicateEmail = await checkDuplicateEmail();
    if (duplicateEmail) {
      setEmailError("Email này đã tồn tại! Vui lòng chọn email khác.");
      return;
    }

    try {
      const payload = {
        ...user,
        User_ID: Number(user.User_ID),
      };

      if (passwordData.NewPassword) {
        payload.CurrentPassword = passwordData.CurrentPassword;
        payload.NewPassword = passwordData.NewPassword;
      }

      if (imageChanged) {
        payload.UserPicture = user.UserPicture || "";
      } else {
        delete payload.UserPicture;
      }

      const res = await api.post("update_user.php", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.success) {
        if (res.data.message?.toLowerCase().includes("mật khẩu")) {
          setPasswordError(res.data.message);
        } else if (res.data.message?.toLowerCase().includes("email")) {
          setEmailError(res.data.message);
        } else {
          setAlert({ type: "error", message: res.data.message });
        }
        return;
      }

      const freshUser = res.data.user || payload;
      setAlert({ type: "success", message: res.data.message });
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
      setImageChanged(false);
      setPasswordData({
        CurrentPassword: "",
        NewPassword: "",
        ConfirmPassword: "",
      });
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      console.error(err);
      setAlert({ type: "warning", message: "Có lỗi khi cập nhật." });
    }
  };

  if (loading) return <Loading />;
  if (!user)
    return <p className="text-center text-red-500">Không tìm thấy người dùng</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Thông tin cá nhân (Admin)</h2>

      <Notification type={alert.type} message={alert.message} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center mb-6 pb-6 border-b">
          <label className="text-sm font-semibold mb-3 text-gray-700">Ảnh đại diện</label>

          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-400 transition-all shadow-lg">
              {user.UserPicture ? (
                <img
                  src={user.UserPicture}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
              )}
            </div>

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center max-w-xs">
            Nhấn vào biểu tượng camera để thay đổi ảnh đại diện (tối đa 500KB)
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Họ tên</label>
            <input
              name="Fullname"
              value={user.Fullname || ""}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 ${
                inputErrors.Fullname ? "border-red-400" : ""
              }`}
            />
            {inputErrors.Fullname && (
              <p className="text-sm text-red-600 mt-1 font-medium">
                {inputErrors.Fullname}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              <b>Lưu ý:</b> Tên chỉ được <b>TỐI ĐA</b> 30 ký tự.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              name="Email"
              type="email"
              value={user.Email || ""}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 ${
                emailError ? "border-red-400" : ""
              }`}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1 font-medium">{emailError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Số điện thoại</label>
            <input
              name="Phone"
              value={user.Phone || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Ngày sinh</label>
            <input
              name="Birthday"
              type="date"
              value={user.Birthday || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Địa chỉ</label>
          <input
            name="Address"
            value={user.Address || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div>
            <label className="block text-sm font-semibold mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              name="CurrentPassword"
              value={passwordData.CurrentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, CurrentPassword: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Mật khẩu mới</label>
            <input
              type="password"
              name="NewPassword"
              value={passwordData.NewPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, NewPassword: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="ConfirmPassword"
              value={passwordData.ConfirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, ConfirmPassword: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        {passwordError && (
          <p className="text-sm text-red-600 mt-2 font-medium">{passwordError}</p>
        )}

        <p className="text-xs text-gray-500">
          <b>Lưu ý:</b> Mật khẩu phải có <b>ÍT NHẤT</b> 8 ký tự, 1 chữ in hoa, 1 ký tự đặc biệt và 1 chữ số.
        </p>

        <div className="text-center">
          <button
            type="submit"
            className="px-50 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}
