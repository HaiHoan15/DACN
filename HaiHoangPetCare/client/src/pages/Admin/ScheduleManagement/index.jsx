import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import Loading from "../_Components/Loading";
import Notification from "../_Components/Notification";
import BranchTab from "./ScheduleOptions/BranchTab";
import RoomTab from "./ScheduleOptions/RoomTab";
import DoctorTab from "./ScheduleOptions/DoctorTab";
import WeeklySchedule from "./ScheduleOptions/WeeklySchedule";
import AppointmentTable from "./ScheduleOptions/AppointmentTable";
import BranchModal from "./ScheduleOptions/BranchModal";
import RoomModal from "./ScheduleOptions/RoomModal";
import DoctorModal from "./ScheduleOptions/DoctorModal";
import AppointmentModal from "./ScheduleOptions/AppointmentModal";

export default function ScheduleManagement() {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Data states
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Selection states - ĐỔI THỨ TỰ: Doctor -> Branch -> Room
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Week navigation
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday.toISOString().split("T")[0];
  });

  // Modal states
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Search/Filter
  const [searchDate, setSearchDate] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "all", "today", "upcoming", "past"

  useEffect(() => {
    fetchAllData();
  }, []);

  // KHI ĐỔI BÁC SĨ → RESET branch & room
  useEffect(() => {
    if (selectedDoctor) {
      setSelectedBranch(null);
      setSelectedRoom(null);
      fetchBranchesByDoctor(selectedDoctor);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedDoctor && selectedBranch) {
      setSelectedRoom(null);
      fetchRoomsByDoctorAndBranch(selectedDoctor, selectedBranch);
    }
  }, [selectedDoctor, selectedBranch]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchScheduleData();
    }
  }, [selectedDoctor, currentWeek]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedBranch, selectedRoom, selectedDoctor, searchDate, dateFilter]);

  const fetchAllData = async () => {
    try {
      const [doctorRes] = await Promise.all([
        api.get("get_all_doctors.php"),
      ]);

      setDoctors(doctorRes.data || []);

      if (doctorRes.data && doctorRes.data.length > 0) {
        setSelectedDoctor(doctorRes.data[0].Doctor_ID);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setAlert({ type: "error", message: "Không thể tải dữ liệu!" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchesByDoctor = async (doctorId) => {
    try {
      const res = await api.get(`get_branches_by_doctor.php?doctor_id=${doctorId}`);
      setBranches(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedBranch(res.data[0].Branch_ID);
      } else {
        setSelectedBranch(null);
        setRooms([]);
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const fetchRoomsByDoctorAndBranch = async (doctorId, branchId) => {
    try {
      const res = await api.get(`get_rooms_by_doctor_and_branch.php?doctor_id=${doctorId}&branch_id=${branchId}`);
      setRooms(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedRoom(res.data[0].Room_ID);
      } else {
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải phòng:", err);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const res = await api.get(
        `get_schedule_slots.php?doctor_id=${selectedDoctor}&week_start=${currentWeek}`
      );
      setScheduleData(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải lịch:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      let url = "get_all_appointments.php?";
      
      // CHỈ filter theo doctor, KHÔNG filter branch/room
      if (selectedDoctor) url += `doctor_id=${selectedDoctor}`;
      if (searchDate) url += `&date=${searchDate}`;

      console.log("=== FETCH APPOINTMENTS ===");
      console.log("URL:", url);
      console.log("selectedDoctor:", selectedDoctor);
      console.log("dateFilter:", dateFilter);

      const res = await api.get(url);
      
      console.log("Response data length:", res.data?.length);
      console.log("Response data:", res.data);
      
      let filteredData = res.data || [];
      
      // Áp dụng bộ lọc theo ngày
      if (dateFilter !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filteredData = filteredData.filter(appointment => {
          const appointmentDate = new Date(appointment.AppointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          
          if (dateFilter === "today") {
            return appointmentDate.getTime() === today.getTime();
          } else if (dateFilter === "upcoming") {
            return appointmentDate.getTime() >= today.getTime();
          } else if (dateFilter === "past") {
            return appointmentDate.getTime() < today.getTime();
          }
          return true;
        });
      }
      
      setAppointments(filteredData);
    } catch (err) {
      console.error("Lỗi khi tải lịch khám:", err);
      setAppointments([]);
    }
  };

  // Branch handlers
  const handleAddBranch = () => {
    setModalMode("add");
    setSelectedItem(null);
    setShowBranchModal(true);
  };

  const handleSaveBranch = async (data) => {
    try {
      const endpoint = modalMode === "add" ? "add_branch.php" : "update_branch.php";
      const payload = modalMode === "add" ? data : { ...data, Branch_ID: selectedItem.Branch_ID };

      const res = await api.post(endpoint, payload);
      if (res.data?.success) {
        setAlert({ type: "success", message: res.data.message });
        fetchBranchesByDoctor(selectedDoctor);
        setShowBranchModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Thao tác thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (!confirm(`Xóa chi nhánh "${branch.BranchName}"?\n\nLưu ý: Tất cả phòng khám và lịch hẹn thuộc chi nhánh này cũng sẽ bị xóa!`)) {
      return;
    }
    
    try {
      const res = await api.post("delete_branch.php", { Branch_ID: branch.Branch_ID });
      if (res.data?.success) {
        setAlert({ type: "success", message: "Đã xóa chi nhánh!" });
        fetchBranchesByDoctor(selectedDoctor);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Xóa thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  // Room handlers
  const handleAddRoom = () => {
    if (!selectedBranch) {
      alert("Vui lòng chọn chi nhánh trước!");
      return;
    }
    setModalMode("add");
    setSelectedItem(null);
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (data) => {
    try {
      const endpoint = modalMode === "add" ? "add_room.php" : "update_room.php";
      const payload = modalMode === "add" ? data : { ...data, Room_ID: selectedItem.Room_ID };

      const res = await api.post(endpoint, payload);
      if (res.data?.success) {
        setAlert({ type: "success", message: res.data.message });
        fetchRoomsByDoctorAndBranch(selectedDoctor, selectedBranch);
        setShowRoomModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Thao tác thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!confirm(`Xóa phòng "${room.RoomName}"?\n\nLưu ý: Tất cả lịch hẹn thuộc phòng này cũng sẽ bị xóa!`)) {
      return;
    }
    
    try {
      const res = await api.post("delete_room.php", { Room_ID: room.Room_ID });
      if (res.data?.success) {
        setAlert({ type: "success", message: "Đã xóa phòng!" });
        fetchRoomsByDoctorAndBranch(selectedDoctor, selectedBranch);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Xóa thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  // Doctor handlers
  const handleAddDoctor = () => {
    setModalMode("add");
    setSelectedItem(null);
    setShowDoctorModal(true);
  };

  const handleSaveDoctor = async (data) => {
    try {
      const endpoint = modalMode === "add" ? "add_doctor.php" : "update_doctor.php";
      const payload = modalMode === "add" ? data : { ...data, Doctor_ID: selectedItem.Doctor_ID };

      const res = await api.post(endpoint, payload);
      if (res.data?.success) {
        setAlert({ type: "success", message: res.data.message });
        fetchAllData();
        setShowDoctorModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Thao tác thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    if (!confirm(`Xóa bác sĩ "${doctor.DoctorName}"?`)) {
      return;
    }
    
    try {
      const res = await api.post("delete_doctor.php", { Doctor_ID: doctor.Doctor_ID });
      if (res.data?.success) {
        setAlert({ type: "success", message: "Đã xóa bác sĩ!" });
        fetchAllData();
      } else {
        setAlert({ type: "error", message: res.data?.message || "Xóa thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  // Appointment handlers
  const handleAddAppointment = () => {
    setModalMode("add");
    setSelectedItem(null);
    setShowAppointmentModal(true);
  };

  const handleSaveAppointment = async (data) => {
    try {
      const endpoint = modalMode === "add" ? "add_appointment.php" : "update_appointment.php";
      const payload =
        modalMode === "add" ? data : { ...data, Appointment_ID: selectedItem.Appointment_ID };

      const res = await api.post(endpoint, payload);
      if (res.data?.success) {
        setAlert({ type: "success", message: res.data.message });
        fetchAppointments();
        fetchScheduleData();
        setShowAppointmentModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Thao tác thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      const res = await api.post("delete_appointment.php", {
        Appointment_ID: selectedItem.Appointment_ID,
      });
      if (res.data?.success) {
        setAlert({ type: "success", message: "Đã xóa lịch khám!" });
        fetchAppointments();
        fetchScheduleData();
        setShowAppointmentModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Xóa thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  // Week navigation
  const handlePrevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(prev.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(next.toISOString().split("T")[0]);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {alert.message && (
        <Notification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="max-w-[1600px] mx-auto">
        {/* Phần 1: Tiêu đề + Ngày tháng */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Quản lý lịch khám
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý lịch hẹn và theo dõi cuộc khám
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Ngày hiện tại</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Phần 2: Tabs - ĐỔI THỨ TỰ */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 space-y-4">
          <DoctorTab
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
            onAddDoctor={handleAddDoctor}
            onDeleteDoctor={handleDeleteDoctor}
          />
          <BranchTab
            branches={branches}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
            onAddBranch={handleAddBranch}
            onDeleteBranch={handleDeleteBranch}
          />
          <RoomTab
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
          />
        </div>

        {/* Phần 3: Lịch tuần + Nút thêm lịch */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700">Tìm theo ngày:</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleAddAppointment}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg font-bold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm lịch khám
            </button>
          </div>

          {selectedDoctor ? (
            <WeeklySchedule
              currentWeek={currentWeek}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              scheduleData={scheduleData}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">Vui lòng chọn bác sĩ để xem lịch</p>
            </div>
          )}
        </div>

        {/* Phần 4: Bảng lịch khám */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col gap-4 mb-6">
            {/* Tiêu đề và số lượng */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Danh sách lịch khám
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tổng cộng: <span className="font-semibold text-blue-600">{appointments.length}</span> lịch khám
                </p>
              </div>
            </div>
            
            {/* Bộ lọc theo ngày - BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={() => setDateFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dateFilter === "all"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setDateFilter("today")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dateFilter === "today"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setDateFilter("upcoming")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dateFilter === "upcoming"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chưa qua ngày
              </button>
              <button
                onClick={() => setDateFilter("past")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dateFilter === "past"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã qua ngày
              </button>
            </div>
          </div>
          
          <AppointmentTable
            appointments={appointments}
            onViewAppointment={(apt) => {
              setModalMode("view");
              setSelectedItem(apt);
              setShowAppointmentModal(true);
            }}
            onEditAppointment={(apt) => {
              setModalMode("edit");
              setSelectedItem(apt);
              setShowAppointmentModal(true);
            }}
            onDeleteAppointment={(apt) => {
              setModalMode("delete");
              setSelectedItem(apt);
              setShowAppointmentModal(true);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <BranchModal
        show={showBranchModal}
        mode={modalMode}
        branch={selectedItem}
        onClose={() => setShowBranchModal(false)}
        onSave={handleSaveBranch}
        onDelete={() => {}}
      />

      <RoomModal
        show={showRoomModal}
        mode={modalMode}
        room={selectedItem}
        branches={branches}
        selectedBranch={selectedBranch}
        onClose={() => setShowRoomModal(false)}
        onSave={handleSaveRoom}
        onDelete={() => {}}
      />

      <DoctorModal
        show={showDoctorModal}
        mode={modalMode}
        doctor={selectedItem}
        onClose={() => setShowDoctorModal(false)}
        onSave={handleSaveDoctor}
        onDelete={() => {}}
      />

      <AppointmentModal
        show={showAppointmentModal}
        mode={modalMode}
        appointment={selectedItem}
        branches={branches}
        selectedBranch={selectedBranch}
        onClose={() => setShowAppointmentModal(false)}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
}