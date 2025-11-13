import React from "react";

const formatVND = (n) => {
  const num = Number(n);
  if (Number.isNaN(num)) return "N/A";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
};

export default function ProductTable({ products, onViewProduct, onEditProduct, onDeleteProduct }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Ảnh</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Danh mục</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Giá</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.Product_ID} className="hover:bg-blue-50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <img
                    src={p.ProductPicture || "/images/product.png"}
                    alt={p.ProductName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/product.png";
                    }}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {p.ProductName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {p.Category || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatVND(p.Price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onViewProduct(p)}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                      title="Xem chi tiết"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => onEditProduct(p)}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}