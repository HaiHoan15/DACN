import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../API/api";
import Loading from "../_Components/Loading";
import NumberBox from "../_Components/NumberBox";
import Notification from "../_Components/Notification";
import WOW from "wowjs";
import "animate.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  // --- Lấy thông tin sản phẩm ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get("get_product_by_id.php", { params: { id } });
        setProduct(res.data);
      } catch (error) {
        console.error("Không thể tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loading />;
  if (!product)
    return <p className="text-center py-10">Không tìm thấy sản phẩm</p>;

  const totalPrice = Number(product.Price) * quantity;

  // --- Khi nhấn "Mua ngay" ---
  const handleBuy = async () => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser) {
      navigate("/dang-nhap");
      return;
    }

    try {
      const res = await api.post(
        "wishlist.php",
        {
          User_ID: localUser.User_ID,
          Product_ID: product.Product_ID,
          Quantity: quantity, 
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setAlert({ type: "success", message: res.data.message });
        setTimeout(() => window.location.reload(), 750);
      } else {
        setAlert({ type: "warning", message: res.data.message });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Không thể thêm sản phẩm. Vui lòng thử lại!",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10 animate__animated animate__fadeIn"
      style={{ backgroundImage: "url('/images/background/product-bg1.jpg')" }}
    >
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-10 space-y-6">
        {/* --- Thông báo nổi góc phải --- */}
        <div className="fixed top-6 right-6 z-50 w-auto max-w-sm">
          <Notification type={alert.type} message={alert.message} />
        </div>

        {/* --- Thanh điều hướng ( quay lại) --- */}
        <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-6">
          <div className="text-left">
            <span
              className="text-gray-500 hover:text-indigo-600 cursor-pointer"
              onClick={() => navigate("/san-pham")}
            >
              Sản phẩm
            </span>{" "}
            /{" "}
            <span className="text-gray-500">
              {product.Category || "Chưa xác định"}
            </span>{" "}
            /{" "}
            <span className="text-indigo-600 font-semibold">
              {product.Product_ID}
            </span>
          </div>

          <button
            onClick={() => navigate("/san-pham")}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-all"
          >
            <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại
          </button>
        </div>

        {/* --- Nội dung sản phẩm --- */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* --- Hình ảnh sản phẩm --- */}
          <div className="space-y-4">
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={product.ProductPicture}
                alt={product.ProductName}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* --- Thông tin sản phẩm --- */}
          <div className="flex flex-col">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.ProductName}
              </h1>

              <p className="text-indigo-600 font-medium mb-1">
                Nhà sản xuất: {product.Supplier}
              </p>

              <p className="text-orange-700 font-medium mb-4">
                Thể loại: {product.Category || "Chưa xác định"}
              </p>

              <p className="text-gray-700 leading-relaxed mb-6 break-words">
                {product.Description || "Không có mô tả sản phẩm."}
              </p>
            </div>

            {/* --- số lượng, giá và nút mua --- */}
            <div className="mt-auto">
              {/* Giá & Số lượng */}
              <div className="flex items-end justify-between mb-4">
                <NumberBox value={quantity} setValue={setQuantity} />
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1 font-medium">
                    Thành tiền
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>

              {/* --- Nút Mua --- */}
              <button
                onClick={handleBuy}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all text-lg shadow-md flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-cart-shopping"></i>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
