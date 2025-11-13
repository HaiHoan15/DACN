import React, { useEffect, useState } from "react";
import api from "../../../../API/api";
import WeeklySchedule from "./ScheduleComponents/WeeklySchedule";
import AppointmentList from "./ScheduleComponents/AppointmentList";

export default function Schedule() {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("calendar"); // 'calendar' hoặc 'list'
  
  // Week navigation
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday.toISOString().split("T")[0];
  });

  // LẤY USER_ID TỪ LOCALSTORAGE
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

  useEffect(() => {
    if (userId) {
      fetchScheduleData();
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [userId, currentWeek, dateFilter]);

  const fetchScheduleData = async () => {
    try {
      // CHỈ LẤY LỊCH CỦA USER TRONG TUẦN
      const res = await api.get(`get_all_appointments.php?user_id=${userId}`);
      const allAppointments = res.data || [];
      
      // LỌC RA CÁC LỊCH TRONG TUẦN HIỆN TẠI VÀ CỦA USER
      const startDate = new Date(currentWeek);
      const endDate = new Date(currentWeek);
      endDate.setDate(endDate.getDate() + 6);
      
      const weekAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.AppointmentDate);
        const isInWeek = aptDate >= startDate && aptDate <= endDate;
        const isMyAppointment = Number(apt.User_ID) === Number(userId);
        return isInWeek && isMyAppointment;
      });
      
      // CHUYỂN ĐỔI FORMAT CHO WEEKLYSCHEDULE
      const formattedData = weekAppointments.map(apt => {
        const aptDate = new Date(apt.AppointmentDate);
        const dayOfWeek = aptDate.getDay() === 0 ? 8 : aptDate.getDay() + 1; // 2-8
        
        return {
          ...apt,
          DayOfWeek: dayOfWeek,
          isUserAppointment: true // Tất cả đều là lịch của user
        };
      });
      
      setScheduleData(formattedData);
    } catch (err) {
      console.error("Lỗi khi tải lịch tuần:", err);
      setScheduleData([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      // LẤY TẤT CẢ LỊCH CỦA USER
      const res = await api.get(`get_all_appointments.php?user_id=${userId}`);
      
      // LỌC LẠI PHÍA CLIENT ĐỂ ĐẢM BẢO CHỈ LẤY LỊCH CỦA USER
      let filteredData = (res.data || []).filter(apt => {
        return Number(apt.User_ID) === Number(userId);
      });
      
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
    } finally {
      setLoading(false);
    }
  };

  const handlePrevWeek = () => {
    const prevMonday = new Date(currentWeek);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setCurrentWeek(prevMonday.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const nextMonday = new Date(currentWeek);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentWeek(nextMonday.toISOString().split("T")[0]);
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 text-lg font-semibold">Vui lòng đăng nhập để xem lịch khám</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch khám...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Lịch khám của tôi
            </h1>
            <p className="text-sm text-gray-500">
              Xem lịch khám và theo dõi cuộc hẹn của bạn
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "calendar"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Lịch tuần</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "list"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Danh sách lịch khám ({appointments.length})</span>
              </div>
            </button>
          </div>
        </div>

      {/* Tab Content */}
      {activeTab === "calendar" ? (
        /* Lịch tuần */
        <WeeklySchedule
          currentWeek={currentWeek}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          scheduleData={scheduleData}
        />
      ) : (
        /* Danh sách lịch khám */
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col gap-4 mb-6">
            {/* Tiêu đề và số lượng */}
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Danh sách lịch khám
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Tổng cộng: <span className="font-semibold text-blue-600">{appointments.length}</span> lịch khám
              </p>
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

          <AppointmentList appointments={appointments} />
        </div>
      )}
      </div>
    </div>
  );
}