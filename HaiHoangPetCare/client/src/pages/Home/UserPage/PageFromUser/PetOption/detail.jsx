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
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header ảnh */}
      <div className="relative">
        <img
          src={pet.PetPicture || "/images/pet-default.png"}
          alt={pet.PetName}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <h2 className="absolute bottom-4 left-6 text-3xl font-bold text-white drop-shadow-lg">
          {pet.PetName}
        </h2>
      </div>

      {/* Nội dung chi tiết */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-blue-600">
          🐕 Thông tin chi tiết
        </h3>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">🧬 Loài:</p>
            <p>{pet.Species || "Không rõ"}</p>
          </div>
          <div>
            <p className="font-semibold">🐾 Giống:</p>
            <p>{pet.Breed || "Không rõ"}</p>
          </div>
          <div>
            <p className="font-semibold">🚻 Giới tính:</p>
            <p>{pet.Gender}</p>
          </div>
          <div>
            <p className="font-semibold">🎂 Ngày sinh:</p>
            <p>{pet.Birthday || "Không rõ"}</p>
          </div>
          <div>
            <p className="font-semibold">📅 Tuổi:</p>
            <p>{calcAge(pet.Birthday)} tuổi</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
}
