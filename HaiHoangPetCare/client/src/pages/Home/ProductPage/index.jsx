import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import ProductCard from "../_Components/ProductCard";
import Loading from "../_Components/Loading";
import Pagination from "../_Components/Pagination";

//  AOS
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Khởi động AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    api
      .get("get_products.php")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, []);

  const categories = [
    "Tất cả",
    ...new Set(products.map((p) => p.Category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "Tất cả" || p.Category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      style={{ backgroundImage: "url('/images/background/product-bg2.jpg')" }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        
        {/* --- Tiêu đề + Tìm kiếm + Thể loại --- */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 animate__animated animate__fadeInDown relative z-20"
          data-aos="fade-down"
        >
          <h2 className="inline-block bg-white/70 text-[#2563EB] text-2xl md:text-3xl font-bold px-6 py-2 rounded-2xl shadow-md backdrop-blur-sm">
            Các sản phẩm của chúng tôi
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            
            {/* Tìm kiếm */}
            <div className="relative w-full sm:w-80" data-aos="fade-left">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-lg py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                  shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>

            {/* Dropdown */}
            <div
              className="relative w-full sm:w-48"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <span className="font-semibold text-gray-800">
                  {selectedCategory === "Tất cả" ? "Thể loại" : selectedCategory}
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
                      className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b last:border-b-0 ${
                        selectedCategory === category
                          ? "bg-indigo-100 text-indigo-700 font-bold"
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

        {/* --- Thông báo kết quả tìm kiếm --- */}
        {(searchTerm || selectedCategory !== "Tất cả") && (
          <div
            className="mb-4 text-gray-700 font-medium bg-white rounded-lg p-4 shadow relative z-10"
            data-aos="fade"
          >
            <p>
              Tìm thấy{" "}
              <span className="font-bold text-indigo-600">
                {filteredProducts.length}
              </span>{" "}
              sản phẩm
              {searchTerm && ` cho "${searchTerm}"`}
              {selectedCategory !== "Tất cả" &&
                ` trong thể loại "${selectedCategory}"`}
            </p>
          </div>
        )}

        {/* --- Phân trang đầu --- */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        {/* --- Lưới sản phẩm --- */}
        <div
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-7 relative z-0"
          data-aos="fade-up"
        >
          {displayedProducts.length > 0 ? (
            displayedProducts.map((p) => (
              <ProductCard key={p.Product_ID} product={p} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              {products.length === 0 ? (
                <Loading />
              ) : (
                <div className="text-gray-500">
                  <p className="text-xl font-semibold">Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm mt-2">Thử từ khóa khác hoặc thể loại khác</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Phân trang cuối --- */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
