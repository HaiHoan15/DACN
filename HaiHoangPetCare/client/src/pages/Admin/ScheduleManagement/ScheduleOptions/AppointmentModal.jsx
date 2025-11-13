import React, { useState, useEffect } from "react";
import api from "../../../../API/api";

export default function AppointmentModal({
  show,
  mode,
  appointment,
  onClose,
  onSave,
  onDelete,
  branches,
  selectedBranch,
}) {
  const [formData, setFormData] = useState({
  User_ID: "",
  Pet_ID: "",
  Branch_ID: selectedBranch || "",
  Room_ID: "",
  Doctor_ID: "",
  AppointmentDate: "",
  Period: "",
  PeriodEnd: "", 
  Reason: "",
  Result: "",
  Status: "pending",
});

  const [users, setUsers] = useState([]);
  //   const [pets, setPets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedUserPets, setSelectedUserPets] = useState([]);

  useEffect(() => {
    if (show) {
      fetchUsers();
      fetchDoctors();
    }
  }, [show]);

  useEffect(() => {
    if (formData.Branch_ID) {
      fetchRoomsByBranch(formData.Branch_ID);
    }
  }, [formData.Branch_ID]);

  useEffect(() => {
    if (formData.User_ID) {
      fetchPetsByUser(formData.User_ID);
    }
  }, [formData.User_ID]);

  useEffect(() => {
  if (appointment && mode !== "add") {
    setFormData({
      User_ID: appointment.User_ID || "",
      Pet_ID: appointment.Pet_ID || "",
      Branch_ID: appointment.Branch_ID || "",
      Room_ID: appointment.Room_ID || "",
      Doctor_ID: appointment.Doctor_ID || "",
      AppointmentDate: appointment.AppointmentDate || "",
      Period: appointment.Period || "",
      PeriodEnd: appointment.PeriodEnd || appointment.Period || "", // Thêm
      Reason: appointment.Reason || "",
      Result: appointment.Result || "",
      Status: appointment.Status || "pending",
    });
  } else if (mode === "add") {
    setFormData({
      User_ID: "",
      Pet_ID: "",
      Branch_ID: selectedBranch || "",
      Room_ID: "",
      Doctor_ID: "",
      AppointmentDate: "",
      Period: "",
      PeriodEnd: "", 
      Reason: "",
      Result: "",
      Status: "pending",
    });
  }
}, [appointment, mode, selectedBranch]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("get_all_users.php");
      // Lọc bỏ UserPicture nếu không cần thiết để tránh lỗi
      const userData = (res.data || []).map(u => ({
        User_ID: u.User_ID,
        Fullname: u.Fullname,
        Email: u.Email,
        Phone: u.Phone
      }));
      setUsers(userData);
    } catch (err) {
      console.error("Lỗi khi lấy users:", err);
      setUsers([]);
    }
  };

  const fetchPetsByUser = async (userId) => {
    try {
      const res = await api.get(`get_pets_by_user.php?user_id=${userId}`);
      setSelectedUserPets(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy pets:", err);
      setSelectedUserPets([]);
    }
  };

  const fetchRoomsByBranch = async (branchId) => {
    try {
      const res = await api.get(`get_rooms_by_branch.php?branch_id=${branchId}`);
      setRooms(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy rooms:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("get_all_doctors.php");
      setDoctors(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy doctors:", err);
    }
  };

  const handleSubmit = () => {
    if (mode === "delete") {
      onDelete();
      return;
    }

    // Validation
    if (!formData.User_ID || !formData.Pet_ID || !formData.AppointmentDate || !formData.Period) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-2xl font-bold">
            {mode === "view" && "Chi tiết lịch khám"}
            {mode === "edit" && "Chỉnh sửa lịch khám"}
            {mode === "add" && "Thêm lịch khám mới"}
            {mode === "delete" && "Xác nhận xóa"}
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === "delete" ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa lịch khám</h4>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa lịch khám này?
                <br />
                Hành động này không thể hoàn tác!
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Hủy
                </button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Xóa lịch khám
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chọn khách hàng */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Khách hàng <span className="text-red-500">*</span>
                </label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.UserName || "N/A"}</p>
                ) : (
                  <select
                    value={formData.User_ID}
                    onChange={(e) => {
                      setFormData({ ...formData, User_ID: e.target.value, Pet_ID: "" });
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {users.map((u) => (
                      <option key={u.User_ID} value={u.User_ID}>
                        {u.Fullname} - {u.Email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Chọn thú cưng */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thú cưng <span className="text-red-500">*</span>
                </label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.PetName || "N/A"}</p>
                ) : (
                  <select
                    value={formData.Pet_ID}
                    onChange={(e) => setFormData({ ...formData, Pet_ID: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!formData.User_ID}
                  >
                    <option value="">-- Chọn thú cưng --</option>
                    {selectedUserPets.map((p) => (
                      <option key={p.Pet_ID} value={p.Pet_ID}>
                        {p.PetName} ({p.Species})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Chi nhánh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chi nhánh</label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.BranchName || "N/A"}</p>
                ) : (
                  <select
                    value={formData.Branch_ID}
                    onChange={(e) => setFormData({ ...formData, Branch_ID: e.target.value, Room_ID: "" })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Chọn chi nhánh --</option>
                    {branches.map((b) => (
                      <option key={b.Branch_ID} value={b.Branch_ID}>
                        {b.BranchName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Phòng khám */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phòng khám</label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.RoomName || "N/A"}</p>
                ) : (
                  <select
                    value={formData.Room_ID}
                    onChange={(e) => setFormData({ ...formData, Room_ID: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!formData.Branch_ID}
                  >
                    <option value="">-- Chọn phòng --</option>
                    {rooms.map((r) => (
                      <option key={r.Room_ID} value={r.Room_ID}>
                        {r.RoomName} ({r.RoomCode})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Bác sĩ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bác sĩ</label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.DoctorName || "N/A"}</p>
                ) : (
                  <select
                    value={formData.Doctor_ID}
                    onChange={(e) => setFormData({ ...formData, Doctor_ID: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {doctors.map((d) => (
                      <option key={d.Doctor_ID} value={d.Doctor_ID}>
                        {d.DoctorName} - {d.DoctorCode}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Ngày khám */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày khám <span className="text-red-500">*</span>
                </label>
                {mode === "view" ? (
                  <p className="text-gray-900">{new Date(appointment?.AppointmentDate).toLocaleDateString("vi-VN")}</p>
                ) : (
                  <input
                    type="date"
                    value={formData.AppointmentDate}
                    onChange={(e) => setFormData({ ...formData, AppointmentDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>

              {/* Tiết bắt đầu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiết bắt đầu <span className="text-red-500">*</span>
                </label>
                {mode === "view" ? (
                  <p className="text-gray-900">Tiết {appointment?.Period}</p>
                ) : (
                  <select
                    value={formData.Period}
                    onChange={(e) => {
                      const period = parseInt(e.target.value);
                      setFormData({
                        ...formData,
                        Period: period,
                        PeriodEnd: formData.PeriodEnd < period ? period : formData.PeriodEnd
                      });
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Chọn tiết --</option>
                    {Array.from({ length: 16 }, (_, i) => i + 1).map((p) => (
                      <option key={p} value={p}>
                        Tiết {p} {p <= 8 ? "(Sáng)" : "(Chiều)"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Tiết kết thúc */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiết kết thúc <span className="text-red-500">*</span>
                </label>
                {mode === "view" ? (
                  <p className="text-gray-900">Tiết {appointment?.PeriodEnd || appointment?.Period}</p>
                ) : (
                  <select
                    value={formData.PeriodEnd}
                    onChange={(e) => setFormData({ ...formData, PeriodEnd: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!formData.Period}
                  >
                    <option value="">-- Chọn tiết --</option>
                    {Array.from({ length: 16 }, (_, i) => i + 1)
                      .filter((p) => p >= parseInt(formData.Period || 1))
                      .map((p) => (
                        <option key={p} value={p}>
                          Tiết {p} {p <= 8 ? "(Sáng)" : "(Chiều)"}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                {mode === "view" ? (
                  <p className="text-gray-900">
                    {formData.Status === "pending"
                      ? "Chờ xác nhận"
                      : formData.Status === "confirmed"
                        ? "Đã xác nhận"
                        : formData.Status === "completed"
                          ? "Hoàn thành"
                          : "Đã hủy"}
                  </p>
                ) : (
                  <select
                    value={formData.Status}
                    onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                )}
              </div>

              {/* Lý do khám */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lý do khám</label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.Reason || "Không có"}</p>
                ) : (
                  <textarea
                    value={formData.Reason}
                    onChange={(e) => setFormData({ ...formData, Reason: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Nhập lý do khám..."
                  />
                )}
              </div>

              {/* Kết quả */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kết quả khám</label>
                {mode === "view" ? (
                  <p className="text-gray-900">{appointment?.Result || "Chưa có kết quả"}</p>
                ) : (
                  <textarea
                    value={formData.Result}
                    onChange={(e) => setFormData({ ...formData, Result: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Nhập kết quả khám (nếu có)..."
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode !== "delete" && (
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              {mode === "view" ? "Đóng" : "Hủy"}
            </button>
            {mode !== "view" && (
              <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
                {mode === "add" ? "Thêm lịch khám" : "Cập nhật"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}