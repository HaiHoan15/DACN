import React from "react";

export default function NewsSearchBar({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  categories,
  totalNews,
  filteredCount,
  onAddNews,
  onAddCategory,
  onDeleteCategory,
  customCategories,
  news,
}) {
  const isCategoryDeletable = (cat) => {
    if (cat === "ALL") return false;
    const isCustom = customCategories.includes(cat);
    const isUsedInDB = news.some((n) => n.Category === cat);
    return isCustom && !isUsedInDB;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <div className="flex flex-col gap-4">
        {/* Hàng 1: Tiêu đề + Thanh tìm kiếm + Nút thêm tin tức */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              Quản lý tin tức
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || categoryFilter !== "ALL" || statusFilter !== "ALL" ? (
                <>
                  Tìm thấy: <span className="font-semibold text-green-600">{filteredCount}</span> / {totalNews} tin tức
                </>
              ) : (
                <>
                  Tổng cộng: <span className="font-semibold text-green-600">{totalNews}</span> tin tức
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Thanh tìm kiếm */}
            <div className="flex-grow sm:w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tiêu đề, tác giả..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="w-full px-4 py-2 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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

            {/* Nút thêm tin tức */}
            <button
              onClick={onAddNews}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm tin tức
            </button>
          </div>
        </div>

        {/* Hàng 2: Lọc danh mục */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium text-gray-700 mr-2">Danh mục:</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <div key={c} className="relative inline-flex">
                <button
                  onClick={() => onCategoryChange(c)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    categoryFilter === c
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${isCategoryDeletable(c) ? "pr-8" : ""}`}
                >
                  {c === "ALL" ? "Tất cả" : c}
                </button>
                
                {isCategoryDeletable(c) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(c);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center text-xs font-bold"
                    title={`Xóa danh mục "${c}"`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={onAddCategory}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1"
              title="Thêm danh mục mới"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Hàng 3: Lọc trạng thái */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium text-gray-700 mr-2">Trạng thái:</label>
          <div className="flex flex-wrap gap-2">
            {["ALL", "published", "draft"].map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  statusFilter === s
                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s === "ALL" ? "Tất cả" : s === "published" ? "Đã xuất bản" : "Nháp"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}