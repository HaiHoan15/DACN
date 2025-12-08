import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

const formatVND = (n) => {
  const num = Number(n);
  if (Number.isNaN(num)) return "N/A";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
};

export default function ProductModal({
  show,
  mode,
  product,
  formData,
  onClose,
  onUpdate,
  onDelete,
  onFormChange,
  categories,
}) {
  const [errors, setErrors] = useState({});
  const [localImageFile, setLocalImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState("");

  useEffect(() => {
    if (!show) {
      setErrors({});
      setLocalImageFile(null);
      setLocalPreview("");
    }
  }, [show]);

  // Khi mở modal edit, set sẵn preview từ ảnh hiện có
  useEffect(() => {
    if (show && mode === "edit") {
      setLocalPreview(formData?.ProductPicture || product?.ProductPicture || "/images/product.png");
    }
  }, [show, mode, formData?.ProductPicture, product]);

  if (!show) return null;

  const validateName = (name) => {
    if (!name || name.trim() === "") return "Tên không được để trống";
    if (name.length > 150) return "Tên không được quá 150 ký tự";
    if (/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]/.test(name)) return "Tên không được chứa ký tự đặc biệt";
    return "";
  };

  const validatePrice = (price) => {
    if (price === "" || price === null || price === undefined) return "Giá không được để trống";
    const num = Number(price);
    if (Number.isNaN(num)) return "Giá phải là số";
    if (num < 0) return "Giá không được âm";
    return "";
  };

  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setLocalPreview(base64);
        setLocalImageFile(base64);
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      console.error("Lỗi nén ảnh:", err);
    }
  };

  const handleUpdateClick = () => {
    const newErrors = {};
    const nameErr = validateName(formData.ProductName);
    const priceErr = validatePrice(formData.Price);
    if (nameErr) newErrors.ProductName = nameErr;
    if (priceErr) newErrors.Price = priceErr;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onUpdate({ newImageFile: localImageFile });
  };

  const availableCategories = categories?.filter((c) => c !== "ALL") || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h3 className="text-2xl font-bold">
            {mode === "view" && "Chi tiết sản phẩm"}
            {mode === "edit" && "Chỉnh sửa sản phẩm"}
            {mode === "add" && "Thêm sản phẩm mới"}
            {mode === "delete" && "Xác nhận xóa"}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === "view" && product && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-64 h-48 rounded-xl border-4 border-blue-500 bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src={product.ProductPicture || "/images/product.png"}
                    alt={product.ProductName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/product.png";
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên:</p>
                  <p className="font-semibold text-gray-900">{product.ProductName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Danh mục:</p>
                  <p className="font-semibold text-gray-900">{product.Category || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá:</p>
                  <p className="font-semibold text-gray-900">{formatVND(product.Price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nhà cung cấp:</p>
                  <p className="font-semibold text-gray-900">{product.Supplier || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Mô tả:</p>
                  <p className="font-semibold text-gray-900 whitespace-pre-wrap">
                    {product.Description || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(mode === "edit" || mode === "add") && (
            <div className="space-y-4">
              {/* Ảnh sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh sản phẩm
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-32 border-2 border-gray-300 rounded-lg bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src={localPreview || "/images/product.png"}
                      alt="preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/product.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ JPG/PNG/WebP, khuyến nghị &lt; 1MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ProductName}
                  onChange={(e) => handleChange("ProductName", e.target.value)}
                  maxLength={150}
                  className={`w-full px-4 py-2 border ${errors.ProductName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.ProductName && <p className="text-red-500 text-xs mt-1">{errors.ProductName}</p>}
                <p className="text-gray-400 text-xs mt-1">{formData.ProductName.length}/150 ký tự</p>
              </div>

              {/* Danh mục - Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                <select
                  value={formData.Category}
                  onChange={(e) => handleChange("Category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Giá */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.Price}
                  onChange={(e) => handleChange("Price", e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.Price ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.Price && <p className="text-red-500 text-xs mt-1">{errors.Price}</p>}
              </div>

              {/* Nhà cung cấp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp</label>
                <input
                  type="text"
                  value={formData.Supplier}
                  onChange={(e) => handleChange("Supplier", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  rows={4}
                  value={formData.Description}
                  onChange={(e) => handleChange("Description", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {mode === "delete" && product && (
            <div className="text-center py-4">
              <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-semibold text-gray-900 mb-2">Bạn có chắc chắn muốn xóa sản phẩm này?</p>
              <p className="text-gray-600"><span className="font-semibold">{product.ProductName}</span></p>
              <p className="text-sm text-red-500 mt-2">Hành động này không thể hoàn tác!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            {mode === "view" ? "Đóng" : "Hủy"}
          </button>
          {(mode === "edit" || mode === "add") && (
            <button
              onClick={handleUpdateClick}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              {mode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
            </button>
          )}
          {mode === "delete" && (
            <button
              onClick={onDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Xác nhận xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}