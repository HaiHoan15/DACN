import React, { useState } from "react";
import imageCompression from "browser-image-compression";

export default function NewsModal({
  show,
  mode,
  news,
  formData,
  onClose,
  onUpdate,
  onDelete,
  onFormChange,
  categories,
}) {
  const [imagePreview, setImagePreview] = useState(null);

  if (!show) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Lỗi nén ảnh:", error);
      alert("Không thể xử lý ảnh!");
    }
  };

  const handleSubmit = () => {
    if (mode === "delete") {
      onDelete();
      return;
    }

    // Validation
    if (!formData.Title || !formData.Title.trim()) {
      alert("Vui lòng nhập tiêu đề!");
      return;
    }

    if (formData.Title.length > 255) {
      alert("Tiêu đề không được quá 255 ký tự!");
      return;
    }

    if (!formData.Content || !formData.Content.trim()) {
      alert("Vui lòng nhập nội dung!");
      return;
    }

    onUpdate({ newImageFile: imagePreview });
  };

  const availableCategories = categories.filter((c) => c !== "ALL");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-2xl font-bold">
            {mode === "view" && "Chi tiết tin tức"}
            {mode === "edit" && "Chỉnh sửa tin tức"}
            {mode === "add" && "Thêm tin tức mới"}
            {mode === "delete" && "Xác nhận xóa"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === "delete" ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa tin tức</h4>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa tin tức <strong>"{news?.Title}"</strong>?
                <br />
                Hành động này không thể hoàn tác!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Xóa tin tức
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="space-y-4">
                {/* Tiêu đề */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  {mode === "view" ? (
                    <p className="text-gray-900 font-medium">{news?.Title}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.Title}
                      onChange={(e) => onFormChange({ ...formData, Title: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập tiêu đề tin tức"
                      maxLength={255}
                    />
                  )}
                </div>

                {/* Tóm tắt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tóm tắt</label>
                  {mode === "view" ? (
                    <p className="text-gray-700">{news?.Summary || "Không có"}</p>
                  ) : (
                    <textarea
                      value={formData.Summary}
                      onChange={(e) => onFormChange({ ...formData, Summary: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập tóm tắt ngắn gọn"
                      rows={3}
                    />
                  )}
                </div>

                {/* Tác giả */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tác giả</label>
                  {mode === "view" ? (
                    <p className="text-gray-700">{news?.Author || "Không rõ"}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.Author}
                      onChange={(e) => onFormChange({ ...formData, Author: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập tên tác giả"
                    />
                  )}
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                  {mode === "view" ? (
                    <p className="text-gray-700">{news?.Category || "Chung"}</p>
                  ) : (
                    <select
                      value={formData.Category}
                      onChange={(e) => onFormChange({ ...formData, Category: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  {mode === "view" ? (
                    <p className="text-gray-700">
                      {news?.Status === "published" ? "Đã xuất bản" : "Nháp"}
                    </p>
                  ) : (
                    <select
                      value={formData.Status}
                      onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="draft">Nháp</option>
                      <option value="published">Đã xuất bản</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-4">
                {/* Hình ảnh */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
                  {mode === "view" ? (
                    <div className="w-full h-64 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img
                        src={news?.NewsPicture || "/images/news.png"}
                        alt={news?.Title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/images/news.png")}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden mb-2">
                        <img
                          src={imagePreview || formData.NewsPicture || "/images/news.png"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = "/images/news.png")}
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                    </>
                  )}
                </div>

                {/* Lượt xem (chỉ hiện khi view) */}
                {mode === "view" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lượt xem</label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {news?.Views || 0} lượt xem
                    </p>
                  </div>
                )}
              </div>

              {/* Nội dung (full width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                {mode === "view" ? (
                  <div className="prose max-w-none p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div dangerouslySetInnerHTML={{ __html: news?.Content }} />
                  </div>
                ) : (
                  <textarea
                    value={formData.Content}
                    onChange={(e) => onFormChange({ ...formData, Content: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập nội dung chi tiết..."
                    rows={10}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode !== "delete" && (
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              {mode === "view" ? "Đóng" : "Hủy"}
            </button>
            {mode !== "view" && (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors font-medium"
              >
                {mode === "add" ? "Thêm tin tức" : "Cập nhật"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}