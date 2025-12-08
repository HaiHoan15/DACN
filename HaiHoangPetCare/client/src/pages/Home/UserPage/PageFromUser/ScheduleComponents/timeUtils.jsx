// Chuyển đổi Period (giờ) sang dạng hiển thị
export const periodToTime = (period) => {
  if (!period && period !== 0) return "Chưa xác định";
  const hour = parseInt(period);
  return `${hour.toString().padStart(2, '0')}:00`;
};

// Chuyển đổi khoảng Period sang dạng hiển thị
export const periodRangeToTime = (periodStart, periodEnd) => {
  if (!periodStart && periodStart !== 0) return "Chưa xác định";
  
  const start = parseInt(periodStart);
  const end = periodEnd ? parseInt(periodEnd) : start;
  
  return `${start.toString().padStart(2, '0')}:00 - ${end.toString().padStart(2, '0')}:59`;
};

// Lấy label trạng thái
export const getStatusLabel = (status) => {
  const statusMap = {
    'pending': 'Chờ duyệt',
    'confirmed': 'Đã duyệt',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
};

// Lấy màu badge theo trạng thái
export const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'confirmed': 'bg-green-100 text-green-800 border-green-300',
    'completed': 'bg-blue-100 text-blue-800 border-blue-300',
    'cancelled': 'bg-red-100 text-red-800 border-red-300'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};

// Lấy tất cả các khung giờ trong ngày (7:00 - 18:00)
export const getAllTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 17; hour++) {
    slots.push({
      period: hour,
      period_end: hour,
      time_display: `${hour.toString().padStart(2, '0')}:00 - ${hour.toString().padStart(2, '0')}:59`,
      label: `${hour}:00`
    });
  }
  return slots;
};
