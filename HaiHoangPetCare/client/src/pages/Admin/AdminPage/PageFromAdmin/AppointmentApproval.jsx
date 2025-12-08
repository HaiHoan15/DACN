import React, { useState, useEffect } from "react";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading";
import Notification from "../../_Components/Notification";
import Pagination from "../../_Components/Pagination"; 

export default function AppointmentApproval() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [notification, setNotification] = useState({ type: "", message: "" });

  //  STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
    setCurrentPage(1); // reset về trang đầu khi filter
  }, [appointments, searchTerm, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("get_all_appointments.php");
      const pendingAppointments = (res.data || []).filter(
        (apt) => apt.Status === "pending"
      );
      setAppointments(pendingAppointments);
    } catch (err) {
      console.error("Lỗi khi tải lịch khám:", err);
      setNotification({
        type: "error",
        message: "Không thể tải danh sách lịch khám",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchTerm.trim()) {
      filtered = filtered.filter((apt) =>
        apt.UserName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((apt) => {
        const appointmentDate = new Date(apt.AppointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);

        if (dateFilter === "today") return appointmentDate.getTime() === today.getTime();
        if (dateFilter === "upcoming") return appointmentDate.getTime() > today.getTime();
        if (dateFilter === "past") return appointmentDate.getTime() < today.getTime();
        return true;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleApprove = async (appointment) => {
    try {
      const res = await api.post("update_appointment.php", {
        ...appointment,
        Status: "confirmed",
      });

      if (res.data.success) {
        setNotification({
          type: "success",
          message: "Đã duyệt lịch khám thành công!",
        });
        fetchAppointments();
      } else {
        setNotification({
          type: "error",
          message: res.data.message || "Không thể duyệt lịch",
        });
      }
    } catch (err) {
      console.error("Lỗi khi duyệt:", err);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi duyệt lịch khám",
      });
    }
  };

  const handleReject = async (appointment) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch khám này?")) return;

    try {
      const res = await api.post("update_appointment.php", {
        ...appointment,
        Status: "cancelled",
      });

      if (res.data.success) {
        setNotification({
          type: "success",
          message: "Đã hủy lịch khám!",
        });
        fetchAppointments();
      } else {
        setNotification({
          type: "error",
          message: res.data.message || "Không thể hủy lịch",
        });
      }
    } catch (err) {
      console.error("Lỗi khi hủy:", err);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi hủy lịch khám",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getPeriodText = (period) => {
    const periods = {
      1: "7:00 - 8:00",
      2: "8:00 - 9:00",
      3: "9:00 - 10:00",
      4: "10:00 - 11:00",
      5: "13:00 - 14:00",
      6: "14:00 - 15:00",
      7: "15:00 - 16:00",
      8: "16:00 - 17:00",
    };
    return periods[period] || period;
  };

  if (loading) return <Loading />;

  //  PHÂN TRANG
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-8 bg-white shadow-lg rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Danh sách lịch khám chờ duyệt
      </h2>

      <Notification type={notification.type} message={notification.message} />

      {/* Bộ lọc */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex gap-2">
          {["all", "today", "upcoming", "past"].map((type) => (
            <button
              key={type}
              onClick={() => setDateFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateFilter === type
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type === "all"
                ? "Tất cả"
                : type === "today"
                ? "Hôm nay"
                : type === "upcoming"
                ? "Sắp tới"
                : "Đã qua ngày"}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
              <th className="px-4 py-3 text-left font-semibold">Thú cưng</th>
              <th className="px-4 py-3 text-left font-semibold">Ngày khám</th>
              <th className="px-4 py-3 text-left font-semibold">Giờ khám</th>
              <th className="px-4 py-3 text-left font-semibold">Bác sĩ</th>
              <th className="px-4 py-3 text-left font-semibold">Chi nhánh</th>
              <th className="px-4 py-3 text-left font-semibold">Phòng</th>
              <th className="px-4 py-3 text-left font-semibold">Lý do</th>
              <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAppointments.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                  Không có lịch khám nào chờ duyệt
                </td>
              </tr>
            ) : (
              paginatedAppointments.map((apt, index) => (
                <tr
                  key={apt.Appointment_ID}
                  className={`border-b hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">{apt.Appointment_ID}</td>
                  <td className="px-4 py-3 font-medium">{apt.UserName}</td>
                  <td className="px-4 py-3">{apt.PetName}</td>
                  <td className="px-4 py-3">{formatDate(apt.AppointmentDate)}</td>
                  <td className="px-4 py-3">{getPeriodText(apt.Period)}</td>
                  <td className="px-4 py-3">{apt.DoctorName || "Chưa chọn"}</td>
                  <td className="px-4 py-3">{apt.BranchName || "Chưa chọn"}</td>
                  <td className="px-4 py-3">{apt.RoomName || "Chưa chọn"}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={apt.Reason}>
                    {apt.Reason || "Không có"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleApprove(apt)}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                      >
                        <i className="fa-solid fa-check mr-1"></i>
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(apt)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                      >
                        <i className="fa-solid fa-xmark mr-1"></i>
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Thống kê */}
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị {filteredAppointments.length} / {appointments.length} lịch khám chờ duyệt
      </div>

      {/* PHÂN TRANG */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
