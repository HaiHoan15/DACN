import React from "react";

export default function PetTable({ pets, onViewPet, onEditPet, onDeletePet }) {
  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <p className="text-gray-500 text-lg">Không tìm thấy thú cưng nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Ảnh</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Loài</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Giống</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Chủ sở hữu</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr
                key={pet.Pet_ID}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="w-20 h-14 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
                    <img
                      src={pet.PetPicture || "/images/pet/default-pet.png"}
                      alt={pet.PetName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/pet/default-pet.png";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {pet.PetName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {pet.Species || "N/A"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {pet.Breed || "N/A"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {pet.OwnerName || "N/A"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onViewPet(pet)}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                      title="Xem chi tiết"
                    >
                      Xem
                    </button>

                    <button
                      onClick={() => onEditPet(pet)}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => onDeletePet(pet)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}