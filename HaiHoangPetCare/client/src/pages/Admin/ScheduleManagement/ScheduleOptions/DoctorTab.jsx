import React from "react";

export default function DoctorTab({
  doctors,
  selectedDoctor,
  onSelectDoctor,
  onAddDoctor,
  onDeleteDoctor, // Thêm prop này
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-sm font-bold text-gray-700">Bác sĩ:</label>
      <div className="flex flex-wrap gap-2">
        {doctors.map((d) => (
          <div key={d.Doctor_ID} className="relative inline-flex">
            <button
              onClick={() => onSelectDoctor(d.Doctor_ID)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedDoctor === d.Doctor_ID
                  ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg pr-8"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {d.DoctorName} - {d.DoctorCode}
            </button>
            {selectedDoctor === d.Doctor_ID && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDoctor(d);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center text-xs font-bold"
                title={`Xóa bác sĩ "${d.DoctorName}"`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddDoctor}
          className="px-4 py-2 rounded-lg font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-all"
        >
          + Thêm bác sĩ
        </button>
      </div>
    </div>
  );
}