import React, { useState, useEffect } from "react";
import api from "../../../../../API/api";
import { periodRangeToTime } from "./timeUtils";

export default function BookAppointment({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Chọn bác sĩ/chi nhánh, 2: Chọn ngày/giờ, 3: Xác nhận
  
  // Data
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [pets, setPets] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    doctorId: "",
    branchId: "",
    roomId: "",
    petId: "",
    appointmentDate: "",
    period: "",
    periodEnd: "",
    reason: ""
  });
  
  // Get user from localStorage
  const getUser = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };
  
  const user = getUser();
  const userId = user?.User_ID;
  
  // Load initial data
  useEffect(() => {
    if (userId) {
      fetchDoctors();
      fetchPets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  
  // Load branches when doctor selected
  useEffect(() => {
    if (formData.doctorId) {
      fetchBranches();
    } else {
      setBranches([]);
      setRooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctorId]);
  
  // Load rooms when branch selected
  useEffect(() => {
    if (formData.doctorId && formData.branchId) {
      fetchRooms();
    } else {
      setRooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctorId, formData.branchId]);
  
  // Load available slots when all required fields are filled
  useEffect(() => {
    if (formData.doctorId && formData.branchId && formData.roomId && formData.appointmentDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctorId, formData.branchId, formData.roomId, formData.appointmentDate]);
  
  const fetchDoctors = async () => {
    try {
      const res = await api.get("get_all_doctors.php");
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bác sĩ:", err);
    }
  };
  
  const fetchBranches = async () => {
    try {
      const res = await api.get(`get_branches_by_doctor.php?doctor_id=${formData.doctorId}`);
      setBranches(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách chi nhánh:", err);
    }
  };
  
  const fetchRooms = async () => {
    try {
      const res = await api.get(
        `get_rooms_by_doctor_and_branch.php?doctor_id=${formData.doctorId}&branch_id=${formData.branchId}`
      );
      setRooms(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng:", err);
    }
  };
  
  const fetchPets = async () => {
    try {
      const res = await api.get(`get_pets_by_user.php?user_id=${userId}`);
      setPets(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách thú cưng:", err);
    }
  };
  
  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `get_available_slots.php?doctor_id=${formData.doctorId}&branch_id=${formData.branchId}&room_id=${formData.roomId}&date=${formData.appointmentDate}`
      );
      
      console.log('Available slots response:', res.data); // Debug log
      
      if (res.data.success) {
        setAvailableSlots(res.data.slots || []);
      } else {
        console.error('Failed to fetch slots:', res.data.message);
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải khung giờ:", err);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert("Vui lòng đăng nhập để đặt lịch!");
      return;
    }
    
    if (!formData.petId || !formData.appointmentDate || !formData.period) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    
    try {
      setLoading(true);
      const appointmentData = {
        User_ID: userId,
        Pet_ID: parseInt(formData.petId),
        Doctor_ID: parseInt(formData.doctorId),
        Branch_ID: parseInt(formData.branchId),
        Room_ID: parseInt(formData.roomId),
        AppointmentDate: formData.appointmentDate,
        Period: parseInt(formData.period),
        PeriodEnd: formData.periodEnd ? parseInt(formData.periodEnd) : parseInt(formData.period),
        Reason: formData.reason || "",
        Status: "pending" // Chờ admin duyệt
      };
      
      console.log('Submitting appointment:', appointmentData); // Debug log
      
      const res = await api.post("add_appointment.php", appointmentData);
      
      console.log('Response:', res.data); // Debug log
      
      if (res.data.success) {
        alert("Đặt lịch thành công! Vui lòng đợi admin duyệt.");
        onSuccess?.();
        onClose();
      } else {
        alert(res.data.message || "Đặt lịch thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi đặt lịch:", err);
      alert(`Có lỗi xảy ra khi đặt lịch: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const canProceedToStep2 = formData.doctorId && formData.branchId && formData.roomId && formData.petId;
  const canProceedToStep3 = canProceedToStep2 && formData.appointmentDate && formData.period;
  
  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Đặt lịch khám</h2>
              <p className="text-sm opacity-90 mt-1">
                Bước {step}/3: {step === 1 ? "Chọn bác sĩ & thú cưng" : step === 2 ? "Chọn ngày & giờ" : "Xác nhận"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 flex gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white bg-opacity-30'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white bg-opacity-30'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white bg-opacity-30'}`}></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Chọn bác sĩ, chi nhánh, phòng, thú cưng */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Chọn bác sĩ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bác sĩ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value, branchId: "", roomId: "" })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((doc) => (
                    <option key={doc.Doctor_ID} value={doc.Doctor_ID}>
                      {doc.DoctorName} - {doc.DoctorCode}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Chọn chi nhánh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chi nhánh <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value, roomId: "" })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  disabled={!formData.doctorId}
                  required
                >
                  <option value="">-- Chọn chi nhánh --</option>
                  {branches.map((branch) => (
                    <option key={branch.Branch_ID} value={branch.Branch_ID}>
                      {branch.BranchName}
                    </option>
                  ))}
                </select>
                {!formData.doctorId && (
                  <p className="text-xs text-gray-500 mt-1">Vui lòng chọn bác sĩ trước</p>
                )}
              </div>
              
              {/* Chọn phòng */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phòng khám <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  disabled={!formData.branchId}
                  required
                >
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map((room) => (
                    <option key={room.Room_ID} value={room.Room_ID}>
                      {room.RoomName} - {room.RoomCode}
                    </option>
                  ))}
                </select>
                {!formData.branchId && (
                  <p className="text-xs text-gray-500 mt-1">Vui lòng chọn chi nhánh trước</p>
                )}
              </div>
              
              {/* Chọn thú cưng */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thú cưng <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">-- Chọn thú cưng --</option>
                  {pets.map((pet) => (
                    <option key={pet.Pet_ID} value={pet.Pet_ID}>
                      {pet.PetName} ({pet.Species})
                    </option>
                  ))}
                </select>
                {pets.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước khi đặt lịch.
                  </p>
                )}
              </div>
              
              {/* Lý do khám (optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lý do khám (tùy chọn)
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  rows={3}
                  placeholder="Mô tả triệu chứng hoặc lý do đưa thú cưng đi khám..."
                />
              </div>
              
              {/* Navigation */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    canProceedToStep2
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Chọn ngày và giờ */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Chọn ngày */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày khám <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value, period: "", periodEnd: "" })}
                  min={today}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              
              {/* Hiển thị khung giờ khả dụng */}
              {formData.appointmentDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chọn khung giờ <span className="text-red-500">*</span>
                  </label>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Đang tải khung giờ...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.period}
                          type="button"
                          onClick={() => {
                            if (slot.available) {
                              setFormData({ 
                                ...formData, 
                                period: slot.period.toString(),
                                periodEnd: slot.period_end.toString()
                              });
                            }
                          }}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                            formData.period === slot.period.toString()
                              ? 'bg-blue-600 text-white border-blue-600'
                              : slot.available
                              ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          <div className="font-bold">{slot.time_display}</div>
                          {!slot.available && (
                            <div className="text-xs mt-1">
                              <div className="text-red-600">Đã đặt</div>
                              {slot.user_name && (
                                <div className="text-gray-500 truncate">
                                  {slot.user_name} - {slot.pet_name}
                                </div>
                              )}
                              <div className={`inline-block px-2 py-0.5 rounded-full text-xs mt-1 ${
                                slot.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {slot.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">Không có khung giờ nào</p>
                  )}
                  
                  {/* Chú thích */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📌 Lưu ý:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Khung giờ màu xanh: Còn trống, có thể đặt</li>
                      <li>• Khung giờ màu xám: Đã có người đặt (chờ duyệt hoặc đã duyệt)</li>
                      <li>• Sau khi đặt lịch, vui lòng đợi admin duyệt</li>
                      <li>• Giờ làm việc: 7:00 - 18:00</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    canProceedToStep3
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Xác nhận thông tin */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin đặt lịch</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bác sĩ</p>
                    <p className="font-semibold text-gray-800">
                      {doctors.find(d => d.Doctor_ID == formData.doctorId)?.DoctorName}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Chi nhánh</p>
                    <p className="font-semibold text-gray-800">
                      {branches.find(b => b.Branch_ID == formData.branchId)?.BranchName}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Phòng khám</p>
                    <p className="font-semibold text-gray-800">
                      {rooms.find(r => r.Room_ID == formData.roomId)?.RoomName}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Thú cưng</p>
                    <p className="font-semibold text-gray-800">
                      {pets.find(p => p.Pet_ID == formData.petId)?.PetName}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Ngày khám</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(formData.appointmentDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Giờ khám</p>
                    <p className="font-semibold text-gray-800">
                      {periodRangeToTime(formData.period, formData.periodEnd)}
                    </p>
                  </div>
                </div>
                
                {formData.reason && (
                  <div>
                    <p className="text-sm text-gray-600">Lý do khám</p>
                    <p className="text-gray-800">{formData.reason}</p>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-800">Lưu ý quan trọng</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Lịch khám của bạn sẽ ở trạng thái "Chờ duyệt" và cần được admin xác nhận. 
                        Vui lòng kiểm tra lại thông tin trước khi xác nhận.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Xác nhận đặt lịch'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
