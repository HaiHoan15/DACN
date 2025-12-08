import React, { useEffect, useState } from "react";
import api from "../../../../API/api";
import Loading from "../../_Components/Loading";
import Pagination from "../../_Components/Pagination";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [processing, setProcessing] = useState(false);

  const [orderInfo, setOrderInfo] = useState({
    fullname: user?.Fullname || "",
    email: user?.Email || "",
    shippingAddress: user?.Address || "",
    phone: user?.Phone || "",
    note: ""
  });

  // Load wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setLoading(false);
        setAlert({ type: "error", message: "Vui lòng đăng nhập để xem Wishlist." });
        return;
      }
      try {
        const res = await api.get("get_wishlist.php", {
          params: { user_id: user.User_ID },
        });
        const data = Array.isArray(res.data)
          ? res.data.map((it) => ({ ...it, Quantity: Number(it.Quantity || 1) }))
          : [];
        setWishlist(data);
      } catch {
        setAlert({ type: "error", message: "Không thể tải danh sách yêu thích." });
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Delete wishlist item
  const handleRemove = async (wishlistId) => {
    try {
      await api.post("delete_wishlist.php", { Wishlist_ID: wishlistId });
      setWishlist((prev) => prev.filter((i) => Number(i.Wishlist_ID) !== Number(wishlistId)));
      setAlert({ type: "warning", message: "Đã xóa sản phẩm khỏi Wishlist." });
    } catch {
      setAlert({ type: "error", message: "Lỗi khi xóa sản phẩm." });
    }
  };

  // Update quantity
  const handleQuantityChange = async (wishlistId, newQty) => {
    newQty = Math.max(1, Math.min(999, newQty));

    setWishlist((prev) =>
      prev.map((item) =>
        Number(item.Wishlist_ID) === Number(wishlistId)
          ? { ...item, Quantity: newQty }
          : item
      )
    );

    try {
      await api.post("update_wishlist_quantity.php", {
        Wishlist_ID: wishlistId,
        Quantity: Number(newQty),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Total price
  const total = wishlist.reduce(
    (sum, it) => sum + Number(it.Price) * Number(it.Quantity || 1),
    0
  );

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = wishlist.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!orderInfo.shippingAddress || !orderInfo.phone || !orderInfo.fullname) {
      setAlert({ type: "error", message: "Vui lòng điền đầy đủ thông tin bắt buộc!" });
      return;
    }

    if (processing) return;
    setProcessing(true);

    try {
      const orderData = {
        user_id: user.User_ID,
        total_amount: total,
        shipping_address: orderInfo.shippingAddress,
        phone: orderInfo.phone,
        note: orderInfo.note,
        payment_method: paymentMethod,
        items: wishlist.map((item) => ({
          product_id: item.Product_ID,
          product_name: item.ProductName,
          price: item.Price,
          quantity: item.Quantity,
        })),
      };

      // ===============================
      // CASE 1 — COD → Tạo đơn luôn
      // ===============================
      if (paymentMethod === "COD") {
        const res = await api.post("create_order.php", orderData, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.data.success) {
          setAlert({ type: "error", message: res.data.message || "Đặt hàng thất bại!" });
          setProcessing(false);
          return;
        }

        setAlert({ type: "success", message: "Đặt hàng thành công!" });
        setShowCheckoutModal(false);

        // Xóa wishlist
        for (const item of wishlist) {
          await api.post("delete_wishlist.php", { Wishlist_ID: item.Wishlist_ID });
        }

        setWishlist([]);

        setTimeout(() => {
          navigate("/nguoi-dung?tab=order");
        }, 1500);

        setProcessing(false);
        return;
      }

      // ===============================
      // CASE 2 — MOMO (tạo order + redirect)
      // ===============================
      if (paymentMethod === "MOMO") {
        const momoRes = await api.post(
          "create_momo_payment.php",
          {
            amount: total,
            orderInfo: "Thanh toán đơn hàng",
            user_id: user.User_ID,
            items: orderData.items,
            shipping_address: orderInfo.shippingAddress,
            phone: orderInfo.phone,
            note: orderInfo.note,
            total_amount: total,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!momoRes.data.success) {
          setAlert({
            type: "error",
            message: momoRes.data.message || "Không tạo được phiên thanh toán!",
          });
          setProcessing(false);
          return;
        }

        // Nếu backend trả merchant_order_id → có thể lưu nếu muốn
        const merchantOrderId = momoRes.data.merchant_order_id;
        if (merchantOrderId) {
          localStorage.setItem("pending_order_id", merchantOrderId);
        }

        // Chuyển tới MoMo
        window.location.href = momoRes.data.payUrl;
        return;
      }

    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
    }


    setProcessing(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">Danh sách sản phẩm đã chọn</h2>

        {/* Nếu wishlist rỗng */}
        {wishlist.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">Bạn chưa có sản phẩm nào trong Wishlist.</p>
            <button
              onClick={() => navigate("/san-pham")}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Xem sản phẩm
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            {/* Sản phẩm */}
            {displayedItems.map((item) => (
              <div
                key={item.Wishlist_ID}
                className="flex items-center justify-between py-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.ProductPicture || "/images/product.png"}
                    alt={item.ProductName}
                    className="w-20 h-20 object-cover rounded-md border cursor-pointer"
                    onClick={() => navigate(`/san-pham/${item.Product_ID}`)}
                    onError={(e) => (e.target.src = "/images/product.png")}
                  />
                  <div>
                    <p
                      className="font-semibold text-lg text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/san-pham/${item.Product_ID}`)}
                    >
                      {item.ProductName}
                    </p>
                    <p className="text-orange-600 font-bold mt-1">
                      {(Number(item.Price) * Number(item.Quantity || 1)).toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={item.Quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.Wishlist_ID, Number(e.target.value))
                    }
                    className="w-20 text-center border rounded-md py-1"
                  />
                  <button
                    onClick={() => handleRemove(item.Wishlist_ID)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

            {/* Tổng cộng */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t">
              <p className="text-xl font-semibold text-gray-800">
                Tổng cộng:
                <span className="text-orange-600 ml-3 font-bold">
                  {total.toLocaleString("vi-VN")} VND
                </span>
              </p>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Xác nhận mua
              </button>
            </div>
          </div>
        )}

        {/* Modal Thanh Toán */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Thông tin đặt hàng</h3>

              <div className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={orderInfo.fullname}
                    onChange={(e) => setOrderInfo({ ...orderInfo, fullname: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={orderInfo.email}
                    className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                    readOnly
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={orderInfo.phone}
                    onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={orderInfo.shippingAddress}
                    onChange={(e) => setOrderInfo({ ...orderInfo, shippingAddress: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Ghi chú</label>
                  <textarea
                    value={orderInfo.note}
                    onChange={(e) => setOrderInfo({ ...orderInfo, note: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                {/* Payment */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phương thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="mr-2"
                      />
                      COD (Thanh toán khi nhận hàng)
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="MOMO"
                        checked={paymentMethod === "MOMO"}
                        onChange={() => setPaymentMethod("MOMO")}
                        className="mr-2"
                      />
                      MoMo (ATM / Ví MoMo)
                    </label>
                  </div>
                </div>

                {/* Warning for MoMo */}
                {paymentMethod === "MOMO" && (
                  <p className="text-red-600 text-sm font-bold">
                    ⚠ Lưu ý: TUYỆT ĐỐI KHÔNG THANH TOÁN BẰNG THẺ THẬT!!!
                  </p>
                )}

                {/* Tổng */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700">
                    Tổng thanh toán:
                    <span className="text-orange-600 font-bold ml-2">
                      {total.toLocaleString("vi-VN")} VND
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    Phương thức thanh toán:
                    <span className="font-semibold ml-1">
                      {paymentMethod === "COD"
                        ? "COD (Thanh toán khi nhận hàng)"
                        : "MoMo (ATM / Ví MoMo)"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 bg-gray-300 py-2 px-4 rounded-lg font-semibold"
                >
                  Hủy
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  {processing ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert */}
        {alert.message && (
          <div
            className={`fixed bottom-6 right-6 px-4 py-2 rounded-md shadow-md z-50 ${alert.type === "success"
              ? "bg-green-100 text-green-700"
              : alert.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
}
