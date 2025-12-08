//thẻ sản phẩm
import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // kiểm tra đăng nhập cho thẻ sản phẩm
  // const isLoggedIn = localStorage.getItem("user");
  // const handleBuy = (e) => {
  //   e.stopPropagation();
  //   if (!isLoggedIn) {
  //     navigate("/dang-nhap");
  //   } else {
  //     navigate("/san-pham");
  //   }
  // };

  const handleDetail = () => {
    navigate(`/san-pham/${product.id || product.Product_ID}`);
  };

  return (
    <div
      onClick={handleDetail}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer w-full max-w-xs mx-auto duration-300 flex flex-col h-full"
    >
      {/* Ảnh sản phẩm */}
      <div className="flex-shrink-0">
        <img
          src={product.ProductPicture || "/images/product.png"}
          alt={product.ProductName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/product.png";
          }}
          className="w-full h-56 object-cover"
        />
      </div>

      {/* Nội dung */}
      <div className="p-4 text-left flex flex-col flex-grow justify-between">
        {/* Tên sản phẩm */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3rem]">
          {product.ProductName}
        </h3>
        {/* Mô tả sản phẩm */}
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[1rem]">
          Thể loại: {product.Category || "Không xác định!"}
        </p>
        {/* Giá và nút mua ngay */}
        <div className="flex items-center justify-between ">
          <p className="text-lg font-semibold text-orange-600">
            {Number(product.Price).toLocaleString("vi-VN")}đ
          </p>
          <button
            onClick={handleDetail}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;