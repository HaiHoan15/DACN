import React from "react";
import { periodToTime} from "../../../Home/UserPage/PageFromUser/ScheduleComponents/timeUtils";
// , getStatusColor 
export default function WeeklySchedule({
  currentWeek,
  onPrevWeek,
  onNextWeek,
  scheduleData,
  // selectedRoom,
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

  // Chỉ hiển thị giờ từ 7:00 - 17:00
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 7);

  const getScheduleForSlot = (dayValue, hour) => {
    return scheduleData.find(
      (s) => s.DayOfWeek === dayValue && hour >= s.Period && hour <= (s.PeriodEnd || s.Period)
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
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
        >
          ← Tuần trước
        </button>
        <h3 className="text-xl font-bold text-gray-900">
          Tuần: {weekDates[0].toLocaleDateString("vi-VN")} -{" "}
          {weekDates[6].toLocaleDateString("vi-VN")}
        </h3>
        <button
          onClick={onNextWeek}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
        >
          Tuần sau →
        </button>
      </div>

      {/* Bảng lịch */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
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
            {timeSlots.map((hour) => (
              <tr key={`hour-${hour}`} className="hover:bg-gray-50">
                <td className={`border border-gray-300 px-3 py-2 text-center font-semibold ${
                  hour < 12 ? 'bg-yellow-100' : 'bg-orange-100'
                }`}>
                  <div className="text-sm font-bold">{periodToTime(hour)}</div>
                  <div className="text-[10px] text-gray-600">{hour < 12 ? 'Sáng' : 'Chiều'}</div>
                </td>
                {daysOfWeek.map((day) => {
                  const schedule = getScheduleForSlot(day.value, hour);
                  // const statusColor = schedule?.Status ? getStatusColor(schedule.Status) : '';
                  
                  return (
                    <td
                      key={`${day.value}-${hour}`}
                      className={`border border-gray-300 px-2 py-3 text-center text-xs ${
                        schedule
                          ? "bg-yellow-50 border-2 border-yellow-400"
                          : "bg-white"
                      }`}
                    >
                      {schedule ? (
                        <div className="font-medium text-[10px] leading-tight space-y-0.5">
                          <div className="font-bold text-blue-700 truncate" title={schedule.BranchName}>
                            {schedule.BranchName}
                          </div>
                          <div className="text-gray-700 truncate" title={schedule.RoomName}>
                            {schedule.RoomName}
                          </div>
                          <div className="text-green-700 font-semibold truncate" title={schedule.UserName}>
                            {schedule.UserName}
                          </div>
                          <div className="text-purple-600 truncate" title={schedule.PetName}>
                            {schedule.PetName}
                          </div>
                          {/* {schedule.Status && (
                            <div className={`text-[8px] font-bold px-1 py-0.5 rounded ${statusColor}`}>
                              {schedule.Status === 'pending' ? 'Chờ duyệt' : 
                               schedule.Status === 'confirmed' ? 'Đã duyệt' : 
                               schedule.Status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                            </div>
                          )} */}
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
          <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-400"></div>
          <span>Đã đặt lịch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300"></div>
          <span>Trống</span>
        </div>
      </div>
    </div>
  );
}