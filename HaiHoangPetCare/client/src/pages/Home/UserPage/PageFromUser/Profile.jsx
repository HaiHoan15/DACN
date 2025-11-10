import React, { useEffect, useState } from "react";
import api from "../../../../API/api";
import Notification from "../../_Components/Notification";
import Loading from "../../_Components/Loading";
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

    // Nếu là email thì không cần kiểm tra ký tự đặc biệt
    if (["Fullname", "Address", "Phone"].includes(name)) {
      const error = validateInput(name, value);
      setInputErrors((prev) => ({ ...prev, [name]: error }));
    }

    setUser((prev) => ({ ...prev, [name]: value }));

    if (name === "Email") setEmailError("");
  };

  const validateInput = (name, value) => {
    // Cho phép chữ, số, dấu cách, và các ký tự tiếng Việt có dấu
    const regex = /^[\p{L}\p{N}\s]+$/u;

    if (value.length > 30) {
      return "Tối đa 30 ký tự.";
    }

    if (!regex.test(value)) {
      return "Không được chứa ký tự đặc biệt.";
    }

    return ""; // không lỗi
  };

  // === Xử lý ảnh ===
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

  // === Kiểm tra mật khẩu hợp lệ ===
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

  // === Kiểm tra trùng email ===
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

  // === Cập nhật thông tin ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setEmailError("");
    setAlert({ type: "", message: "" });

    // Kiểm tra mật khẩu frontend
    const pwdError = validatePassword();
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    // Kiểm tra trùng email
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

      // Phân loại lỗi từ backend
      if (!res.data.success) {
        if (res.data.message?.toLowerCase().includes("mật khẩu")) {
          setPasswordError(res.data.message); // lỗi mật khẩu hiển thị ở dưới
        } else if (res.data.message?.toLowerCase().includes("email")) {
          setEmailError(res.data.message); // lỗi email hiển thị dưới input
        } else {
          setAlert({ type: "error", message: res.data.message });
        }
        return;
      }

      // === Thành công ===
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
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl mt-6" >
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Thông tin cá nhân</h2>

      {/* Thông báo chung (chỉ lỗi tổng quát) */}
      <Notification type={alert.type} message={alert.message} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Thông tin cá nhân */}
        {/* Ảnh đại diện */}
        <div className="mt-6">
          <label className="block text-sm font-semibold mb-1">Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200"
          />
          {user.UserPicture ? (
            <img
              src={user.UserPicture}
              alt="Avatar"
              className="w-24 h-24 mt-3 rounded-full border object-cover"
            />
          ) : (
            <div className="w-24 h-24 mt-3 rounded-full border bg-gray-100 flex items-center justify-center">
              No image
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Họ tên</label>
            <input
              name="Fullname"
              value={user.Fullname || ""}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 ${inputErrors.Fullname ? "border-red-400" : ""
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
              className={`w-full border px-4 py-2 rounded-lg focus:ring focus:ring-blue-200 ${emailError ? "border-red-400" : ""
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

        {/* Mật khẩu */}
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

        {/* Thông báo lỗi mật khẩu nằm đúng vị trí */}
        {passwordError && (
          <p className="text-sm text-red-600 mt-2 font-medium">{passwordError}</p>
        )}

        <p className="text-xs text-gray-500">
          <b>Lưu ý:</b> Mật khẩu phải có <b>ÍT NHẤT</b> 8 ký tự, 1 chữ in hoa, 1 ký tự đặc biệt và 1 chữ số.
        </p>

        {/* Nút lưu */}
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
