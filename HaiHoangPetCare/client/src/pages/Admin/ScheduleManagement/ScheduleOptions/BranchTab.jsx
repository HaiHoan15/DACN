import React from "react";

export default function BranchTab({
  branches,
  selectedBranch,
  onSelectBranch,
  onAddBranch,
  onDeleteBranch, // Thêm prop này
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-sm font-bold text-gray-700">Chi nhánh:</label>
      <div className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <div key={b.Branch_ID} className="relative inline-flex">
            <button
              onClick={() => onSelectBranch(b.Branch_ID)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedBranch === b.Branch_ID
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg pr-8"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {b.BranchName}
            </button>
            {selectedBranch === b.Branch_ID && branches.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBranch(b);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center text-xs font-bold"
                title={`Xóa chi nhánh "${b.BranchName}"`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddBranch}
          className="px-4 py-2 rounded-lg font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
        >
          + Thêm chi nhánh
        </button>
      </div>
    </div>
  );
}