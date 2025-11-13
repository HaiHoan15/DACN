import React, { useState, useEffect } from "react";

export default function PetModal({
  show,
  mode,
  pet,
  formData,
  onClose,
  onUpdate,
  onDelete,
  onFormChange,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!show) setErrors({});
  }, [show]);

  if (!show) return null;

  // Validation giống user: tên <= 30, không ký tự đặc biệt, không rỗng
  const validatePetName = (name) => {
    if (!name || name.trim() === "") return "Tên không được để trống";
    if (name.length > 30) return "Tên không được quá 30 ký tự";
    if (/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]/.test(name)) return "Tên không được chứa ký tự đặc biệt";
    return "";
  };

  const validateBirthday = (birthday) => {
    if (!birthday) return "";
    const selected = new Date(birthday);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected > today) return "Ngày sinh không được sau ngày hôm nay";
    return "";
  };

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleUpdateClick = () => {
    const nameError = validatePetName(formData.PetName);
    const birthdayError = validateBirthday(formData.Birthday);
    const newErrors = {};
    if (nameError) newErrors.PetName = nameError;
    if (birthdayError) newErrors.Birthday = birthdayError;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onUpdate();
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return date.toLocaleDateString("vi-VN");
  };

  const todayStr = () => new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header giống UserModal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h3 className="text-2xl font-bold">
            {mode === "view" && "Chi tiết thú cưng"}
            {mode === "edit" && "Chỉnh sửa thú cưng"}
            {mode === "delete" && "Xác nhận xóa"}
          </h3>
        </div>

        {/* Body giống UserModal (p-6, font sizes) */}
        <div className="p-6">
          {mode === "view" && pet && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-48 h-36 rounded-xl border-4 border-blue-500 bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src={pet.PetPicture || "/images/pet/default-pet.png"}
                    alt={pet.PetName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/pet/default-pet.png";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên:</p>
                  <p className="font-semibold text-gray-900">{pet.PetName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loài:</p>
                  <p className="font-semibold text-gray-900">{pet.Species || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giống:</p>
                  <p className="font-semibold text-gray-900">{pet.Breed || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới tính:</p>
                  <p className="font-semibold text-gray-900">{pet.Gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh:</p>
                  <p className="font-semibold text-gray-900">{formatDate(pet.Birthday)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chủ sở hữu:</p>
                  <p className="font-semibold text-gray-900">{pet.OwnerName || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.PetName}
                  onChange={(e) => handleInputChange("PetName", e.target.value)}
                  maxLength={30}
                  className={`w-full px-4 py-2 border ${
                    errors.PetName ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.PetName && <p className="text-red-500 text-xs mt-1">{errors.PetName}</p>}
                <p className="text-gray-400 text-xs mt-1">{formData.PetName.length}/30 ký tự</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loài</label>
                <input
                  type="text"
                  value={formData.Species}
                  onChange={(e) => handleInputChange("Species", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giống</label>
                <input
                  type="text"
                  value={formData.Breed}
                  onChange={(e) => handleInputChange("Breed", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                <select
                  value={formData.Gender}
                  onChange={(e) => handleInputChange("Gender", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Đực">Đực</option>
                  <option value="Cái">Cái</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.Birthday}
                  onChange={(e) => handleInputChange("Birthday", e.target.value)}
                  max={todayStr()}
                  className={`w-full px-4 py-2 border ${
                    errors.Birthday ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.Birthday && <p className="text-red-500 text-xs mt-1">{errors.Birthday}</p>}
              </div>
            </div>
          )}

          {mode === "delete" && pet && (
            <div className="text-center py-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Bạn có chắc chắn muốn xóa thú cưng này?
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">{pet.PetName}</span>
              </p>
              <p className="text-sm text-red-500 mt-2">Hành động này không thể hoàn tác!</p>
            </div>
          )}
        </div>

        {/* Footer giống UserModal */}
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