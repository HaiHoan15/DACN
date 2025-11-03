import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import ProductCard from "../_Components/ProductCard";

import WOW from "wowjs";
import "animate.css";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
      new WOW.WOW({ live: false }).init();
    }, []);

  useEffect(() => {
    api.get("/PRODUCT")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, []);
 
  return (
    <div className="min-h-screen bg-gray-50 py-10"
      style={{ backgroundImage: "url('/images/background/product-bg1.jpg')" }} >
      <div className="max-w-screen-xl mx-auto px-4">
        {/* tiêu đề */}
        <div className="flex justify-center mb-10 animate__animated animate__fadeInDown">
          <h1 className="text-3xl md:text-4xl font-bold text-white 
                 bg-gradient-to-r from-[#2563EB] to-[#DD6B20] 
                 py-3 px-8 rounded-xl shadow-lg text-center 
                 tracking-wide">
            Danh sách sản phẩm
          </h1>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.Product_ID} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
