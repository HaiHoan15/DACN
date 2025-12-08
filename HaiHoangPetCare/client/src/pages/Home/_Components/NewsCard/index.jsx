import React from "react";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate(`/tin-tuc/${news.News_ID}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={handleDetail}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer w-full max-w-xs mx-auto duration-300 flex flex-col h-full"
    >
      {/* Ảnh tin tức */}
      <div className="flex-shrink-0 relative">
        <img
          src={news.NewsPicture || "/images/news.png"}
          alt={news.Title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/news.png";
          }}
          className="w-full h-56 object-cover"
        />
        {/* Badge danh mục */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
            {news.Category || "Chung"}
          </span>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4 text-left flex flex-col flex-grow justify-between">
        {/* Tiêu đề */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3rem] hover:text-green-600 transition-colors">
          {news.Title}
        </h3>

        {/* Tóm tắt */}
        {news.Summary && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {news.Summary}
          </p>
        )}

        {/* Thông tin bổ sung */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(news.CreatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{news.Views || 0}</span>
            </div>
          </div>
          {news.Author && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{news.Author}</span>
            </div>
          )}
        </div>

        {/* Nút đọc thêm */}
        <button
          onClick={handleDetail}
          className="mt-4 w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Đọc thêm
        </button>
      </div>
    </div>
  );
};

export default NewsCard;