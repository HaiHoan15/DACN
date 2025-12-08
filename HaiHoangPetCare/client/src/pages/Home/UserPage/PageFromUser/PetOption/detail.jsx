import React from "react";
import Notification from "../../../_Components/Notification";

export default function DetailPet({ pet, onBack }) {
  if (!pet)
    return (
      <Notification
        type="error"
        message="Không tìm thấy dữ liệu thú cưng để hiển thị."
      />
    );

  const calcAge = (birthDate) => {
    if (!birthDate) return "Không rõ";
    const birth = new Date(birthDate);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());

    if (diffMonths < 1) return "Dưới 1 tháng";
    if (diffMonths < 12) return `${diffMonths} tháng tuổi`;

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    return months > 0 ? `${years} tuổi ${months} tháng` : `${years} tuổi`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không rõ";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span>Thú cưng</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-semibold">{pet.PetName}</span>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left: Image */}
          <div className="bg-gray-100 p-8 flex items-center justify-center">
            {pet.PetPicture ? (
              <img
                src={pet.PetPicture}
                alt={pet.PetName}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="text-center">
                  <span className="text-8xl opacity-30">🐾</span>
                  <p className="text-gray-500 mt-4">Chưa có ảnh</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pet.PetName}
            </h1>

            {/* Subtitle */}
            <p className="text-blue-600 font-semibold mb-1">
              Chủ sở hữu: {JSON.parse(localStorage.getItem("user"))?.Fullname || "Bạn"}
            </p>
            {/* giới tính */}
            <p className="text-red-700 font-semibold text-sm mb-6">
              Giới tính: {pet.Gender || "Không rõ"}
            </p>

            {/* Info cards */}
            <div className="space-y-4 mb-8">
              {/* Loài */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Loài</span>
                <span className="font-semibold text-gray-900">{pet.Species || "Không rõ"}</span>
              </div>

              {/* Giống */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Giống</span>
                <span className="font-semibold text-gray-900">{pet.Breed || "Không rõ"}</span>
              </div>

              {/* Giới tính */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Giới tính</span>
                <span className="font-semibold text-gray-900">{pet.Gender}</span>
              </div>

              {/* Ngày sinh */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Ngày sinh</span>
                <span className="font-semibold text-gray-900">{formatDate(pet.Birthday)}</span>
              </div>

              {/* Tuổi */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Độ tuổi</span>
                <span className="font-semibold text-blue-600">{calcAge(pet.Birthday)}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Quay về danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}