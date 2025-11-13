import React, { useState, useEffect } from "react";

export default function RoomModal({ show, mode, room, branches, selectedBranch, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    Branch_ID: selectedBranch || "",
    RoomName: "",
    RoomCode: "",
    Status: "active",
  });

  useEffect(() => {
    if (room && mode !== "add") {
      setFormData({
        Branch_ID: room.Branch_ID || "",
        RoomName: room.RoomName || "",
        RoomCode: room.RoomCode || "",
        Status: room.Status || "active",
      });
    } else if (mode === "add") {
      setFormData({
        Branch_ID: selectedBranch || "",
        RoomName: "",
        RoomCode: "",
        Status: "active",
      });
    }
  }, [room, mode, selectedBranch]);

  const handleSubmit = () => {
    if (mode === "delete") {
      onDelete();
      return;
    }

    if (!formData.RoomName.trim() || !formData.RoomCode.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {mode === "add" ? "Thêm phòng khám" : mode === "edit" ? "Sửa phòng khám" : "Xóa phòng khám"}
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
              <p className="text-gray-700 mb-6">Bạn có chắc muốn xóa phòng "{room?.RoomName}"?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Xóa</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chi nhánh *</label>
                <select
                  value={formData.Branch_ID}
                  onChange={(e) => setFormData({ ...formData, Branch_ID: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn chi nhánh --</option>
                  {branches.map((b) => (
                    <option key={b.Branch_ID} value={b.Branch_ID}>
                      {b.BranchName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên phòng *</label>
                <input
                  type="text"
                  value={formData.RoomName}
                  onChange={(e) => setFormData({ ...formData, RoomName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Phòng khám 101"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã phòng *</label>
                <input
                  type="text"
                  value={formData.RoomCode}
                  onChange={(e) => setFormData({ ...formData, RoomCode: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: P101"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700">
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