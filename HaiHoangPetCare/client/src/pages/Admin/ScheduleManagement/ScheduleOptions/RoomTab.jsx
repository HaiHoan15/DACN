import React from "react";

export default function RoomTab({
  rooms,
  selectedRoom,
  onSelectRoom,
  onAddRoom,
  onDeleteRoom, // Thêm prop này
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-sm font-bold text-gray-700">Phòng khám:</label>
      <div className="flex flex-wrap gap-2">
        {rooms.map((r) => (
          <div key={r.Room_ID} className="relative inline-flex">
            <button
              onClick={() => onSelectRoom(r.Room_ID)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedRoom === r.Room_ID
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg pr-8"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r.RoomName} ({r.RoomCode})
            </button>
            {selectedRoom === r.Room_ID && rooms.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRoom(r);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center text-xs font-bold"
                title={`Xóa phòng "${r.RoomName}"`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddRoom}
          className="px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
        >
          + Thêm phòng
        </button>
      </div>
    </div>
  );
}