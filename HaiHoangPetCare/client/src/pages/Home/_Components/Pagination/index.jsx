//ô phân trang

import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null; // Không hiện nếu chỉ có 1 trang

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* Nút Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border-indigo-600"
        }`}
      >
        « Trước
      </button>

      {/* Danh sách số trang */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Nút Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border-indigo-600"
        }`}
      >
        Sau »
      </button>
    </div>
  );
};

export default Pagination;
