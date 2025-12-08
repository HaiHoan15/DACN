import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../API/api";
import Loading from "../_Components/Loading";
import NewsCard from "../_Components/NewsCard";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tăng lượt xem và lấy chi tiết tin tức
    const fetchNewsDetail = async () => {
      try {
        // Tăng lượt xem
        await api.post("increment_news_view.php", { News_ID: id });

        // Lấy chi tiết
        const res = await api.get(`get_news_detail.php?id=${id}`);
        if (res.data && res.data.News_ID) {
          setNews(res.data);

          // Lấy tin liên quan cùng danh mục
          const allNewsRes = await api.get("get_all_news.php");
          const related = allNewsRes.data
            .filter(
              (item) =>
                item.Status === "published" &&
                item.Category === res.data.Category &&
                item.News_ID !== res.data.News_ID
            )
            .slice(0, 4);
          setRelatedNews(related);
        } else {
          navigate("/tin-tuc");
        }
      } catch (err) {
        console.error("Lỗi khi lấy tin tức:", err);
        navigate("/tin-tuc");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <Loading />;
  if (!news) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <button onClick={() => navigate("/tin-tuc")} className="text-green-600 hover:text-green-700 font-medium">
            ← Quay lại danh sách tin tức
          </button>
        </nav>

        {/* Nội dung chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột chính - Chi tiết tin tức */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Hình ảnh */}
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={news.NewsPicture || "/images/news.png"}
                  alt={news.Title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/images/news.png")}
                />
              </div>

              {/* Nội dung */}
              <div className="p-8">
                {/* Danh mục */}
                <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-4">
                  {news.Category}
                </span>

                {/* Tiêu đề */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{news.Title}</h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                  {news.Author && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{news.Author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(news.CreatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{news.Views} lượt xem</span>
                  </div>
                </div>

                {/* Tóm tắt */}
                {news.Summary && (
                  <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
                    <p className="text-gray-700 font-medium italic">{news.Summary}</p>
                  </div>
                )}

                {/* Nội dung chính */}
                <div
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.Content }}
                />

                {/* Tags / Share buttons (tùy chọn) */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Chia sẻ:</span>
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Cột phụ - Tin liên quan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">Tin liên quan</h3>
              <div className="space-y-4">
                {relatedNews.length > 0 ? (
                  relatedNews.map((item) => (
                    <div
                      key={item.News_ID}
                      onClick={() => navigate(`/tin-tuc/${item.News_ID}`)}
                      className="cursor-pointer group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.NewsPicture || "/images/news.png"}
                          alt={item.Title}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => (e.target.src = "/images/news.png")}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                            {item.Title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.CreatedAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Chưa có tin liên quan</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tin tức khác */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Có thể bạn quan tâm</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedNews.map((item) => (
                <NewsCard key={item.News_ID} news={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}