import React, { useState } from "react";

export default function UserModal({
    show,
    mode,
    user,
    formData,
    onClose,
    onUpdate,
    onDelete,
    onFormChange,
}) {
    const [errors, setErrors] = useState({});

    if (!show) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const getRoleText = (role) => {
        switch (role) {
            case "BS":
                return "Admin";
            case "KH":
                return "Khách hàng";
            default:
                return role;
        }
    };

    const getRoleBadge = (role) => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
        switch (role) {
            case "BS":
                return `${baseClass} bg-purple-100 text-purple-700`;
            case "KH":
                return `${baseClass} bg-blue-100 text-blue-700`;
            default:
                return `${baseClass} bg-gray-100 text-gray-700`;
        }
    };

    // Validation cho tên
    const validateFullname = (name) => {
        const specialCharRegex = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]/;

        if (!name || name.trim() === "") {
            return "Tên không được để trống";
        }
        if (name.length > 30) {
            return "Tên không được quá 30 ký tự";
        }
        if (specialCharRegex.test(name)) {
            return "Tên không được chứa ký tự đặc biệt";
        }
        return "";
    };

    const handleFullnameChange = (e) => {
        const value = e.target.value;
        const error = validateFullname(value);
        setErrors({ ...errors, Fullname: error });
        onFormChange({ ...formData, Fullname: value });
    };

    const handleUpdateClick = () => {
        const fullnameError = validateFullname(formData.Fullname);

        if (fullnameError) {
            setErrors({ ...errors, Fullname: fullnameError });
            return;
        }

        setErrors({});
        onUpdate();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                    <h3 className="text-2xl font-bold">
                        {mode === "view" && "Chi tiết người dùng"}
                        {mode === "edit" && "Chỉnh sửa người dùng"}
                        {mode === "delete" && "Xác nhận xóa"}
                    </h3>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {mode === "view" && user && (
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={user.UserPicture || "/images/user.png"}
                                    alt={user.Fullname}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/user.png";
                                    }}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Họ tên:</p>
                                    <p className="font-semibold text-gray-900">{user.Fullname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email:</p>
                                    <p className="font-semibold text-gray-900">{user.Email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại:</p>
                                    <p className="font-semibold text-gray-900">{user.Phone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày sinh:</p>
                                    <p className="font-semibold text-gray-900">{formatDate(user.Birthday)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vai trò:</p>
                                    <span className={getRoleBadge(user.Role)}>
                                        {getRoleText(user.Role)}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Địa chỉ:</p>
                                    <p className="font-semibold text-gray-900">{user.Address || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === "edit" && formData && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.Fullname}
                                    onChange={handleFullnameChange}
                                    maxLength={30}
                                    className={`w-full px-4 py-2 border ${errors.Fullname ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {errors.Fullname && (
                                    <p className="text-red-500 text-xs mt-1">{errors.Fullname}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                    {formData.Fullname.length}/30 ký tự
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.Email}
                                    onChange={(e) => onFormChange({ ...formData, Email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={formData.Phone}
                                    onChange={(e) => onFormChange({ ...formData, Phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    value={formData.Birthday}
                                    onChange={(e) => onFormChange({ ...formData, Birthday: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={formData.Address}
                                    onChange={(e) => onFormChange({ ...formData, Address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vai trò
                                </label>
                                <select
                                    value={formData.Role}
                                    onChange={(e) => onFormChange({ ...formData, Role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="KH">Khách hàng</option>
                                    <option value="BS">Admin</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {mode === "delete" && user && (
                        <div className="text-center py-4">
                            <svg
                                className="mx-auto h-16 w-16 text-red-500 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                                Bạn có chắc chắn muốn xóa người dùng này?
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">{user.Fullname}</span>
                            </p>
                            <p className="text-sm text-red-500 mt-2">
                                Hành động này không thể hoàn tác!
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                        {mode === "view" ? "Đóng" : "Hủy"}
                    </button>
                    {mode === "edit" && (
                        <button
                            onClick={handleUpdateClick}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                            Lưu thay đổi
                        </button>
                    )}
                    {mode === "delete" && (
                        <button
                            onClick={onDelete}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                        >
                            Xác nhận xóa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}