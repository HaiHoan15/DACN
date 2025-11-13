import React from "react";

export default function AppointmentTable({
  appointments,
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Ngày khám</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Tiết</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Khách hàng</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Thú cưng</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Bác sĩ</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Chi nhánh</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Phòng</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Tình trạng</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">Chưa có lịch khám nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.Appointment_ID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(apt.AppointmentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {apt.PeriodEnd && apt.PeriodEnd !== apt.Period 
                      ? `Tiết ${apt.Period}-${apt.PeriodEnd}`
                      : `Tiết ${apt.Period}`
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{apt.UserName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{apt.PetName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{apt.DoctorName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{apt.BranchName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{apt.RoomName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.Status)}`}>
                      {getStatusText(apt.Status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onViewAppointment(apt)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Xem"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEditAppointment(apt)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                        title="Sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteAppointment(apt)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}