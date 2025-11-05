import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import ProductCard from "../_Components/ProductCard";
import Loading from "../_Components/Loading";
import WOW from "wowjs";
import "animate.css";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // số sản phẩm mỗi trang

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  useEffect(() => {
    api
      .get("/PRODUCT")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, []);

  // Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter((p) =>
    p.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Phân trang ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // cuộn lên đầu
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-10"
      style={{ backgroundImage: "url('/images/background/background.jpg')" }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        {/* --- Tiêu đề + Thanh tìm kiếm --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 animate__animated animate__fadeInDown">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2563EB] text-center md:text-left tracking-tight">
            Các sản phẩm của chúng tôi
          </h2>

          <div className="relative w-full md:w-120 mx-auto md:mx-0">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
              }}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-5
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>
        </div>

        {/* --- Lưới sản phẩm --- */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate__animated animate__fadeInUp">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((p) => (
              <ProductCard key={p.Product_ID} product={p} />
            ))
          ) : (
            <div className="col-span-full">
              <Loading />
            </div>
          )}
        </div>

        {/* --- Thanh phân trang --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {/* Nút Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border-indigo-600"
              }`}
            >
              « Trước
            </button>

            {/* Số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Nút Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border-indigo-600"
              }`}
            >
              Sau »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
