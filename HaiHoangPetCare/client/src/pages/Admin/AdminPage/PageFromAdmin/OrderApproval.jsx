import React, { useState, useEffect } from "react";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading";
import Notification from "../../_Components/Notification";
import Pagination from "../../_Components/Pagination"; 

export default function OrderApproval() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [expandedOrder, setExpandedOrder] = useState(null);

  //  STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
    setCurrentPage(1); // reset về trang 1 khi filter
  }, [orders, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("get_all_orders.php");
      const pendingOrders = (res.data || []).filter(
        (order) => order.Status === "pending"
      );
      setOrders(pendingOrders);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      setNotification({ type: "error", message: "Không thể tải danh sách đơn hàng" });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm.trim()) {
      filtered = filtered.filter((order) =>
        order.UserName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleApprove = async (order) => {
    try {
      const res = await api.post("update_order_status.php", {
        Order_ID: order.Order_ID,
        Status: "confirmed",
      });

      if (res.data.success) {
        setNotification({ type: "success", message: "Đã xác nhận đơn hàng thành công!" });
        fetchOrders();
      } else {
        setNotification({ type: "error", message: res.data.message || "Không thể xác nhận đơn" });
      }
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      setNotification({ type: "error", message: "Có lỗi xảy ra khi xác nhận đơn hàng" });
    }
  };

  const handleCancel = async (order) => {
    try {
      const res = await api.post("update_order_status.php", {
        Order_ID: order.Order_ID,
        Status: "cancelled",
      });

      if (res.data.success) {
        setNotification({ type: "success", message: "Đã hủy đơn hàng!" });
        fetchOrders();
      } else {
        setNotification({ type: "error", message: res.data.message || "Không thể hủy đơn hàng" });
      }
    } catch (err) {
      console.error("Lỗi khi hủy đơn:", err);
      setNotification({ type: "error", message: "Có lỗi xảy ra khi hủy đơn hàng" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <Loading />;

  //  TÍNH TOÁN PHÂN TRANG
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 bg-white shadow-lg rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Danh sách đơn hàng chờ xác nhận
      </h2>

      <Notification type={notification.type} message={notification.message} />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Mã ĐH</th>
              <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Tổng tiền</th>
              <th className="px-4 py-3 text-left font-semibold">Loại thanh toán</th>
              <th className="px-4 py-3 text-left font-semibold">Ngày đặt</th>
              <th className="px-4 py-3 text-center font-semibold">Chi tiết</th>
              <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  Không có đơn hàng nào chờ xác nhận
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order, index) => (
                <React.Fragment key={order.Order_ID}>
                  <tr
                    className={`border-b hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">#{order.Order_ID}</td>
                    <td className="px-4 py-3">{order.UserName}</td>
                    <td className="px-4 py-3">{order.Email}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {formatCurrency(order.TotalAmount)}
                    </td>

                    <td className="px-4 py-3">
                      {order.PaymentMethod === "MOMO" ? "MOMO" : "COD"}
                    </td>

                    <td className="px-4 py-3">{formatDate(order.CreatedAt)}</td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleOrderDetails(order.Order_ID)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-sm font-medium"
                      >
                        <i
                          className={`fa-solid fa-chevron-${
                            expandedOrder === order.Order_ID ? "up" : "down"
                          } mr-1`}
                        ></i>
                        {expandedOrder === order.Order_ID ? "Ẩn" : "Xem"}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(order)}
                          className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                        >
                          <i className="fa-solid fa-check mr-1"></i>
                          Xác nhận
                        </button>

                        <button
                          onClick={() => handleCancel(order)}
                          className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                        >
                          <i className="fa-solid fa-times mr-1"></i>
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedOrder === order.Order_ID && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-100">
                        <div className="bg-white p-4 rounded-lg shadow-inner">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Chi tiết đơn hàng #{order.Order_ID}
                          </h4>

                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm">
                              <span className="font-semibold">Địa chỉ giao hàng:</span>{" "}
                              {order.ShippingAddress || "Chưa có"}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="font-semibold">Loại thanh toán:</span>{" "}
                              {order.PaymentMethod}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="font-semibold">SĐT:</span>{" "}
                              {order.Phone || "Chưa có"}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="font-semibold">Ghi chú:</span>{" "}
                              {order.Notes || "Không có"}
                            </p>
                          </div>

                          {order.items && order.items.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="px-3 py-2 text-left">Sản phẩm</th>
                                  <th className="px-3 py-2 text-center">Số lượng</th>
                                  <th className="px-3 py-2 text-right">Đơn giá</th>
                                  <th className="px-3 py-2 text-right">Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx} className="border-b">
                                    <td className="px-3 py-2">{item.ProductName}</td>
                                    <td className="px-3 py-2 text-center">
                                      {item.Quantity}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      {formatCurrency(item.Price)}
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold">
                                      {formatCurrency(item.Price * item.Quantity)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-100 font-bold">
                                  <td colSpan="3" className="px-3 py-2 text-right">
                                    Tổng cộng:
                                  </td>
                                  <td className="px-3 py-2 text-right text-green-600">
                                    {formatCurrency(order.TotalAmount)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Không có sản phẩm nào
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* THỐNG KÊ */}
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị {filteredOrders.length} / {orders.length} đơn hàng chờ xác nhận
      </div>

      {/* PHÂN TRANG */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
