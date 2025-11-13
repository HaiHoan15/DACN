import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import Loading from "../_Components/Loading";
import Notification from "../_Components/Notification";
import Pagination from "../_Components/Pagination";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("get_all_orders.php");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      setAlert({ type: "error", message: "Không thể tải danh sách đơn hàng" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.post("update_order_status.php", {
        Order_ID: orderId,
        Status: newStatus,
      });

      if (res.data?.success) {
        setAlert({ type: "success", message: "Cập nhật trạng thái thành công!" });
        fetchOrders();
        setShowModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Cập nhật thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

    try {
      const res = await api.post("delete_order.php", { Order_ID: orderId });
      if (res.data?.success) {
        setAlert({ type: "success", message: "Đã xóa đơn hàng!" });
        fetchOrders();
        setShowModal(false);
      } else {
        setAlert({ type: "error", message: res.data?.message || "Xóa thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra!" });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xác nhận" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã xác nhận" },
      shipping: { bg: "bg-purple-100", text: "text-purple-800", label: "Đang giao" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Đã giao" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Filter and search
  const filteredOrders = orders.filter(order => {
    const matchStatus = statusFilter === "all" || order.Status === statusFilter;
    const matchSearch = searchTerm === "" || 
      order.Order_ID.toString().includes(searchTerm) ||
      order.UserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Phone?.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  // Pagination
  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentOrders = filteredOrders.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredOrders.length / perPage) || 1;

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {alert.message && (
        <Notification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>

        {/* Search và Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2 flex-wrap">
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
        </div>

        {/* Bảng đơn hàng */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Mã ĐH</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">SĐT</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Ngày đặt</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order.Order_ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        #{order.Order_ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.UserName || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.Phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                        {Number(order.TotalAmount).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.Status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(order.CreatedAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Modal chi tiết */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                {/* Thông tin khách hàng */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-lg mb-3">Thông tin khách hàng</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tên khách hàng</p>
                      <p className="font-medium">{selectedOrder.UserName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{selectedOrder.Phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                      <p className="font-medium">{selectedOrder.ShippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Trạng thái đơn hàng */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-lg mb-3">Cập nhật trạng thái</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["pending", "confirmed", "shipping", "delivered", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.Order_ID, status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedOrder.Status === status
                            ? "bg-blue-600 text-white"
                            : "bg-white border-2 border-gray-200 hover:border-blue-600"
                        }`}
                      >
                        {getStatusBadge(status)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3">Sản phẩm đã đặt</h4>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                <div className="border-t-2 pt-4 mb-6">
                  <div className="flex items-center justify-between text-2xl">
                    <span className="font-bold">Tổng cộng:</span>
                    <span className="font-bold text-orange-600">
                      {Number(selectedOrder.TotalAmount).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* Nút xóa */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.Order_ID)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Xóa đơn hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}