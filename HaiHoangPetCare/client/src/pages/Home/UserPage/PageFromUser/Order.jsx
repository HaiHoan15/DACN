import React, { useEffect, useState } from "react";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`get_user_orders.php?user_id=${user.User_ID}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Chờ xác nhận" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-700", label: "Đã xác nhận" },
      shipping: { bg: "bg-purple-100", text: "text-purple-700", label: "Đang giao" },
      delivered: { bg: "bg-green-100", text: "text-green-700", label: "Đã giao" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Đã hủy" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.Status === statusFilter);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Vui lòng đăng nhập để xem đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <p className="text-blue-100">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-700 mr-2">Lọc theo trạng thái:</span>
            {[
              { value: "all", label: "Tất cả" },
              { value: "pending", label: "Chờ xác nhận" },
              { value: "confirmed", label: "Đã xác nhận" },
              { value: "shipping", label: "Đang giao" },
              { value: "delivered", label: "Đã giao" },
              { value: "cancelled", label: "Đã hủy" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === filter.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách đơn hàng */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.Order_ID} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header đơn hàng */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Đơn hàng #{order.Order_ID}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.CreatedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {getStatusBadge(order.Status)}
                  </div>

                  {/* Thông tin đơn hàng */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                      <p className="font-medium text-gray-900">{order.ShippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">{order.Phone}</p>
                    </div>
                  </div>

                  {/* Tổng tiền */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-gray-700 font-medium">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {Number(order.TotalAmount).toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {/* Nút xem chi tiết */}
                  <button
                    onClick={() => handleViewDetail(order)}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal chi tiết đơn hàng */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h3 className="text-2xl font-bold">Chi tiết đơn hàng #{selectedOrder.Order_ID}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Thông tin chung */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                    {getStatusBadge(selectedOrder.Status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                    <p className="font-medium">{new Date(selectedOrder.CreatedAt).toLocaleString("vi-VN")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</p>
                    <p className="font-medium">{selectedOrder.ShippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-medium">{selectedOrder.Phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phương thức thanh toán</p>
                    <p className="font-medium">{selectedOrder.PaymentMethod || "COD"}</p>
                  </div>
                  {selectedOrder.Note && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                      <p className="font-medium">{selectedOrder.Note}</p>
                    </div>
                  )}
                </div>

                {/* Danh sách sản phẩm */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-bold mb-4">Sản phẩm đã đặt</h4>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.ProductName}</p>
                          <p className="text-sm text-gray-500">
                            {Number(item.Price).toLocaleString("vi-VN")}đ x {item.Quantity}
                          </p>
                        </div>
                        <p className="font-bold text-orange-600">
                          {Number(item.Subtotal).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="border-t mt-6 pt-6">
                  <div className="flex items-center justify-between text-xl">
                    <span className="font-bold text-gray-900">Tổng cộng:</span>
                    <span className="font-bold text-orange-600">
                      {Number(selectedOrder.TotalAmount).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}