import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import NewsCard from "../_Components/NewsCard";
import Loading from "../_Components/Loading";
import Pagination from "../_Components/Pagination";
import WOW from "wowjs";
import "animate.css";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  useEffect(() => {
    api
      .get("get_all_news.php")
      .then((res) => {
        // Chỉ lấy tin đã xuất bản
        const publishedNews = res.data.filter((item) => item.Status === "published");
        setNews(publishedNews);
      })
      .catch((err) => console.error("Lỗi khi lấy tin tức:", err));
  }, []);

  // Lấy danh sách các danh mục duy nhất
  const categories = ["Tất cả", ...new Set(news.map((n) => n.Category).filter(Boolean))];

  // Lọc tin tức theo từ khóa và danh mục
  const filteredNews = news.filter((n) => {
    const matchSearch =
      n.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.Summary && n.Summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = selectedCategory === "Tất cả" || n.Category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Sắp xếp theo ngày mới nhất
  const sortedNews = [...filteredNews].sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

  // Phân trang
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedNews = sortedNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-10"
      style={{ backgroundImage: "url('/images/background/news-bg.jpg')" }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 animate__animated animate__fadeInDown relative z-20">
          <h2 className="inline-block bg-white/70 text-[#059669] text-2xl md:text-3xl font-bold px-6 py-2 rounded-2xl shadow-md backdrop-blur-sm">
            Tin tức & Kiến thức
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Thanh tìm kiếm */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>

            {/* Dropdown Danh mục */}
            <div className="relative w-full sm:w-48">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <span className="font-semibold text-gray-800">
                  {selectedCategory === "Tất cả" ? "Danh mục" : selectedCategory}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b last:border-b-0 ${
                        selectedCategory === category
                          ? "bg-green-100 text-green-700 font-bold"
                          : "text-gray-800 font-medium"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hiển thị số lượng kết quả */}
        {(searchTerm || selectedCategory !== "Tất cả") && (
          <div className="mb-4 text-gray-700 font-medium bg-white rounded-lg p-4 shadow animate__animated animate__fadeIn relative z-10">
            <p>
              Tìm thấy <span className="font-bold text-green-600">{filteredNews.length}</span> tin tức
              {searchTerm && ` cho "${searchTerm}"`}
              {selectedCategory !== "Tất cả" && ` trong danh mục "${selectedCategory}"`}
            </p>
          </div>
        )}

        {/* Phân trang */}
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

        {/* Lưới tin tức */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-7 animate__animated animate__fadeInUp relative z-0">
          {displayedNews.length > 0 ? (
            displayedNews.map((item) => <NewsCard key={item.News_ID} news={item} />)
          ) : (
            <div className="col-span-full text-center py-10">
              {news.length === 0 ? (
                <Loading />
              ) : (
                <div className="text-gray-500">
                  <p className="text-xl font-semibold">Không tìm thấy tin tức nào</p>
                  <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phân trang */}
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}