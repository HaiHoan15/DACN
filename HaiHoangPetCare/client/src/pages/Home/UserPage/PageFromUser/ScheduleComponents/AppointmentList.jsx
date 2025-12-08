import React, { useState } from "react";
import Pagination from "../../../_Components/Pagination"; 
import { periodRangeToTime, getStatusLabel, getStatusColor } from "./timeUtils";

export default function AppointmentList({ appointments }) {

  // PHÂN TRANG 
  const pageSize = 5; // số lịch / trang 
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(appointments.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentAppointments = appointments.slice(startIndex, startIndex + pageSize);


  const getDateStatusBadge = (appointmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    if (apptDate.getTime() === today.getTime()) {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
          Hôm nay
        </span>
      );
    } else if (apptDate.getTime() > today.getTime()) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
          Sắp tới
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
          Đã qua
        </span>
      );
    }
  };


  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 text-lg">Chưa có lịch khám nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {currentAppointments.map((appointment) => (
          <div
            key={appointment.Appointment_ID}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-600 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">

                {/* Header */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">
                    {new Date(appointment.AppointmentDate).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>

                  {getDateStatusBadge(appointment.AppointmentDate)}

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(appointment.Status)}`}>
                    {getStatusLabel(appointment.Status)}
                  </span>
                </div>

                {/* Chi tiết */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Bác sĩ</p>
                        <p className="font-semibold text-gray-900">{appointment.DoctorName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Chi nhánh</p>
                        <p className="font-semibold text-gray-900">{appointment.BranchName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Phòng</p>
                        <p className="font-semibold text-gray-900">{appointment.RoomName}</p>
                      </div>
                    </div>

                  </div>

                  {/* Cột 2 */}
                  <div className="space-y-2">

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Giờ khám</p>
                        <p className="font-semibold text-gray-900">
                          {periodRangeToTime(appointment.Period, appointment.PeriodEnd)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Thú cưng</p>
                        <p className="font-semibold text-gray-900">{appointment.PetName}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Lý do */}
                {appointment.Reason && (
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-gray-500 mb-1">Lý do khám:</p>
                    <p className="text-gray-900">{appointment.Reason}</p>
                  </div>
                )}

                {/* Kết quả */}
                {appointment.Result && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 mt-2">
                    <p className="text-xs text-green-600 mb-1 font-semibold">Kết quả khám:</p>
                    <p className="text-gray-900">{appointment.Result}</p>
                  </div>
                )}
              </div>

              {/* Status Icon */}
              <div className="ml-4">

                {appointment.Status === 'pending' ? (
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : appointment.Status === 'confirmed' ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : appointment.Status === 'completed' ? (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

              </div> {/* End Status Icon */}

            </div> {/* End main row */}

          </div>
        ))}
      </div>

      {/* PHÂN TRANG */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
