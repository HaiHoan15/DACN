import React, { useState, useEffect } from "react";

export default function BranchModal({ show, mode, branch, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    BranchName: "",
    Address: "",
    Phone: "",
    Status: "active",
  });

  useEffect(() => {
    if (branch && mode !== "add") {
      setFormData({
        BranchName: branch.BranchName || "",
        Address: branch.Address || "",
        Phone: branch.Phone || "",
        Status: branch.Status || "active",
      });
    } else if (mode === "add") {
      setFormData({
        BranchName: "",
        Address: "",
        Phone: "",
        Status: "active",
      });
    }
  }, [branch, mode]);

  const handleSubmit = () => {
    if (mode === "delete") {
      onDelete();
      return;
    }

    if (!formData.BranchName.trim()) {
      alert("Vui lòng nhập tên chi nhánh!");
      return;
    }

    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {mode === "add" ? "Thêm chi nhánh" : mode === "edit" ? "Sửa chi nhánh" : "Xóa chi nhánh"}
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {mode === "delete" ? (
            <div className="text-center">
              <p className="text-gray-700 mb-6">Bạn có chắc muốn xóa chi nhánh "{branch?.BranchName}"?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Xóa</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên chi nhánh *</label>
                <input
                  type="text"
                  value={formData.BranchName}
                  onChange={(e) => setFormData({ ...formData, BranchName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập tên chi nhánh"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.Phone}
                  onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
                  {mode === "add" ? "Thêm" : "Cập nhật"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}