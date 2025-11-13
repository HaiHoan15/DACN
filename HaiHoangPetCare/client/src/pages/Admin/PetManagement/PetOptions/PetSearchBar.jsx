import React from "react";

export default function PetSearchBar({
  searchTerm,
  onSearchChange,
  ownerSearch,
  onOwnerSearchChange,
  genderFilter,
  onGenderFilterChange,
  totalPets,
  filteredCount,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <div className="flex flex-col gap-4">
        {/* Tiêu đề */}
        <div className="flex-shrink-0">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Quản lý thú cưng
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm || ownerSearch || genderFilter !== "ALL" ? (
              <>
                Tìm thấy: <span className="font-semibold text-blue-600">{filteredCount}</span> / {totalPets} thú cưng
              </>
            ) : (
              <>
                Tổng cộng: <span className="font-semibold text-blue-600">{totalPets}</span> thú cưng
              </>
            )}
          </p>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Bộ lọc giới tính */}
          <div className="flex gap-2">
            <button
              onClick={() => onGenderFilterChange("ALL")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                genderFilter === "ALL"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onGenderFilterChange("Đực")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                genderFilter === "Đực"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đực
            </button>
            <button
              onClick={() => onGenderFilterChange("Cái")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                genderFilter === "Cái"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cái
            </button>
          </div>

          {/* Ô tìm kiếm thú cưng */}
          <div className="flex-grow max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tên, loài, giống..."
                value={searchTerm}
                onChange={onSearchChange}
                className="w-full px-4 py-2 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => onSearchChange({ target: { value: "" } })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Ô tìm kiếm chủ sở hữu */}
          <div className="flex-grow max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo chủ sở hữu..."
                value={ownerSearch}
                onChange={onOwnerSearchChange}
                className="w-full px-4 py-2 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {ownerSearch && (
                <button
                  onClick={() => onOwnerSearchChange({ target: { value: "" } })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}