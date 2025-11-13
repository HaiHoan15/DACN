import React from "react";

export default function WeeklySchedule({
  currentWeek,
  onPrevWeek,
  onNextWeek,
  scheduleData,
}) {
  const daysOfWeek = [
    { label: "Thứ 2", value: 2 },
    { label: "Thứ 3", value: 3 },
    { label: "Thứ 4", value: 4 },
    { label: "Thứ 5", value: 5 },
    { label: "Thứ 6", value: 6 },
    { label: "Thứ 7", value: 7 },
    { label: "Chủ nhật", value: 8 },
  ];

  const periods = Array.from({ length: 16 }, (_, i) => i + 1);

  const getScheduleForSlot = (dayValue, period) => {
    return scheduleData.find(
      (s) => s.DayOfWeek === dayValue && period >= s.Period && period <= s.PeriodEnd
    );
  };

  const getWeekDates = () => {
    const startDate = new Date(currentWeek);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header điều hướng tuần */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrevWeek}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all shadow-md"
        >
          ← Tuần trước
        </button>
        <h3 className="text-xl font-bold text-gray-900">
          Tuần: {weekDates[0].toLocaleDateString("vi-VN")} -{" "}
          {weekDates[6].toLocaleDateString("vi-VN")}
        </h3>
        <button
          onClick={onNextWeek}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all shadow-md"
        >
          Tuần sau →
        </button>
      </div>

      {/* Bảng lịch */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <th className="border border-gray-300 px-2 py-3 text-sm font-bold w-20"></th>
              {daysOfWeek.map((day, idx) => (
                <th key={day.value} className="border border-gray-300 px-2 py-3 text-sm font-bold">
                  <div>{day.label}</div>
                  <div className="text-xs font-normal mt-1">
                    {weekDates[idx].toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Sáng */}
            <tr className="bg-yellow-100">
              <td colSpan="8" className="border border-gray-300 px-3 py-2 font-bold text-center">
                SÁNG
              </td>
            </tr>
            {periods.slice(0, 8).map((period) => (
              <tr key={`morning-${period}`} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center font-semibold bg-purple-100">
                  Tiết {period}
                </td>
                {daysOfWeek.map((day) => {
                  const schedule = getScheduleForSlot(day.value, period);
                  const isMyAppointment = schedule && schedule.isUserAppointment;
                  return (
                    <td
                      key={`${day.value}-${period}`}
                      className={`border border-gray-300 px-2 py-3 text-center text-xs ${
                        isMyAppointment
                          ? "bg-green-100 border-2 border-green-500"
                          : schedule
                          ? "bg-gray-50"
                          : "bg-white"
                      }`}
                    >
                      {schedule ? (
                        <div className="font-medium text-[10px] leading-tight space-y-0.5">
                          <div className="font-bold text-purple-700 truncate" title={schedule.DoctorName}>
                            BS: {schedule.DoctorName}
                          </div>
                          <div className="font-bold text-blue-700 truncate" title={schedule.BranchName}>
                            {schedule.BranchName}
                          </div>
                          <div className="text-gray-700 truncate" title={schedule.RoomName}>
                            {schedule.RoomName}
                          </div>
                          {isMyAppointment && (
                            <div className="text-green-700 font-bold text-[9px] bg-green-200 px-1 rounded">
                              Lịch của tôi
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Chiều */}
            <tr className="bg-orange-100">
              <td colSpan="8" className="border border-gray-300 px-3 py-2 font-bold text-center">
                CHIỀU
              </td>
            </tr>
            {periods.slice(8, 16).map((period) => (
              <tr key={`afternoon-${period}`} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center font-semibold bg-purple-100">
                  Tiết {period}
                </td>
                {daysOfWeek.map((day) => {
                  const schedule = getScheduleForSlot(day.value, period);
                  const isMyAppointment = schedule && schedule.isUserAppointment;
                  return (
                    <td
                      key={`${day.value}-${period}`}
                      className={`border border-gray-300 px-2 py-3 text-left text-xs ${
                        isMyAppointment
                          ? "bg-green-100 border-2 border-green-500"
                          : schedule
                          ? "bg-gray-50"
                          : "bg-white"
                      }`}
                    >
                      {schedule ? (
                        <div className="font-medium text-[10px] leading-tight space-y-0.5">
                          <div className="font-bold text-purple-700 truncate" title={schedule.DoctorName}>
                            BS: {schedule.DoctorName}
                          </div>
                          <div className="font-bold text-blue-700 truncate" title={schedule.BranchName}>
                            {schedule.BranchName}
                          </div>
                          <div className="text-gray-700 truncate" title={schedule.RoomName}>
                            {schedule.RoomName}
                          </div>
                          {isMyAppointment && (
                            <div className="text-green-700 font-bold text-[9px] bg-green-200 px-1 rounded">
                              Lịch của tôi
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chú thích */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-500"></div>
          <span className="font-medium text-gray-700">Lịch của tôi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-300"></div>
          <span className="text-gray-600">Lịch khác</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300"></div>
          <span className="text-gray-600">Trống</span>
        </div>
      </div>
    </div>
  );
}
