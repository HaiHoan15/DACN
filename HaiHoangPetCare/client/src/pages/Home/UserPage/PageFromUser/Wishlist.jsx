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
  const itemsPerPage = 5; //  mỗi trang 5 sản phẩm
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  //  Lấy danh sách wishlist
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
      } catch (err) {
        console.error("Lỗi khi tải wishlist:", err);
        setAlert({ type: "error", message: "Không thể tải danh sách yêu thích." });
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  //  Xóa sản phẩm
  const handleRemove = async (wishlistId) => {
    try {
      const res = await api.post(
        "delete_wishlist.php",
        { Wishlist_ID: wishlistId },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        setWishlist((prev) =>
          prev.filter((i) => Number(i.Wishlist_ID) !== Number(wishlistId))
        );
        setAlert({ type: "warning", message: "Đã xóa sản phẩm khỏi Wishlist." });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Lỗi khi xóa sản phẩm." });
    }
  };

  //  Cập nhật số lượng (giới hạn 999)
  const handleQuantityChange = async (wishlistId, newQty) => {
    if (newQty < 1) newQty = 1;
    if (newQty > 999) newQty = 999; // giới hạn tối đa

    setWishlist((prev) =>
      prev.map((item) =>
        Number(item.Wishlist_ID) === Number(wishlistId)
          ? { ...item, Quantity: newQty }
          : item
      )
    );

    try {
      await api.post(
        "update_wishlist_quantity.php",
        { Wishlist_ID: wishlistId, Quantity: Number(newQty) },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  //  Tổng giá
  const total = wishlist.reduce(
    (sum, it) => sum + Number(it.Price) * Number(it.Quantity || 1),
    0
  );

  // Tính phân trang
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = wishlist.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">
          Danh sách sản phẩm đã chọn
        </h2>

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
            {/* Danh sách sản phẩm */}
            {displayedItems.map((item) => (
              <div
                key={item.Wishlist_ID}
                className="flex items-center justify-between py-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.ProductPicture}
                    alt={item.ProductName}
                    className="w-20 h-20 object-cover rounded-md border cursor-pointer"
                    onClick={() => navigate(`/san-pham/${item.Product_ID}`)}
                  />
                  <div>
                    <p
                      className="font-semibold text-lg text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/san-pham/${item.Product_ID}`)}
                    >
                      {item.ProductName}
                    </p>
                    <p className="text-orange-600 font-bold mt-1">
                      {(Number(item.Price) * Number(item.Quantity || 1)).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VND
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={item.Quantity}
                    onChange={(e) => {
                      let v = Number(e.target.value);
                      if (v > 999) v = 999;
                      if (v < 1) v = 1;
                      handleQuantityChange(item.Wishlist_ID, v);
                    }}
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

            {/*  Dùng Pagination component */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />

            {/* Tổng cộng */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t">
              <p className="text-xl font-semibold text-gray-800">
                Tổng cộng:
                <span className="text-orange-600 ml-3 font-bold">
                  {total.toLocaleString("vi-VN")} VND
                </span>
              </p>

              <button
                disabled
                className="bg-gray-400 text-white py-2 px-6 rounded-lg font-semibold cursor-not-allowed"
              >
                Xác nhận mua
              </button>
            </div>
          </div>
        )}

        {/* Thông báo nhỏ */}
        {alert.message && (
          <div
            className={`fixed bottom-6 right-6 z-50 rounded-md px-4 py-2 shadow-md ${
              alert.type === "success"
                ? "bg-green-50 text-green-700"
                : alert.type === "warning"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
}
