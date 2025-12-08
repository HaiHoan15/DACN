import React from "react";

export default function UserSearchBar({
    searchTerm,
    onSearchChange,
    totalUsers,
    filteredCount,
    roleFilter,
    onRoleFilterChange
}) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex flex-col gap-4">
                {/* Tiêu đề */}
                <div className="flex-shrink-0">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Quản lý người dùng
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {searchTerm || roleFilter !== "ALL" ? (
                            <>
                                Tìm thấy: <span className="font-semibold text-blue-600">{filteredCount}</span> / {totalUsers} người dùng
                            </>
                        ) : (
                            <>
                                Tổng cộng: <span className="font-semibold text-blue-600">{totalUsers}</span> người dùng
                            </>
                        )}
                    </p>
                </div>

                {/* Search bar và Filter */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Bộ lọc vai trò */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onRoleFilterChange("ALL")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${roleFilter === "ALL"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => onRoleFilterChange("KH")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${roleFilter === "KH"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Khách hàng
                        </button>
                        <button
                            onClick={() => onRoleFilterChange("BS")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${roleFilter === "BS"
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Search bar */}
                    <div className="flex-grow max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                                value={searchTerm}
                                onChange={onSearchChange}
                                className="w-full px-4 py-2 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => onSearchChange({ target: { value: "" } })}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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