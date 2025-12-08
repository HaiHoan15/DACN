import React, { useEffect, useMemo, useState } from "react";

import api from "../../../API/api";
import Loading from "../_Components/Loading";
import Notification from "../_Components/Notification";
import Pagination from "../_Components/Pagination";
import NewsSearchBar from "./NewsOptions/NewsSearchBar";
import NewsTable from "./NewsOptions/NewsTable";
import NewsModal from "./NewsOptions/NewsModal";

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem("customNewsCategories");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    Title: "",
    Summary: "",
    Content: "",
    Author: "",
    NewsPicture: "",
    Category: "",
    Status: "draft",
  });

  const perPage = 10;

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    localStorage.setItem("customNewsCategories", JSON.stringify(customCategories));
  }, [customCategories]);

  const fetchNews = async () => {
    try {
      const res = await api.get("get_all_news.php");
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải news:", err);
      setAlert({ type: "error", message: "Không thể tải danh sách tin tức!" });
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    news.forEach((n) => {
      const c = (n.Category || "").trim();
      if (c) set.add(c);
    });
    customCategories.forEach((c) => set.add(c));
    return ["ALL", ...Array.from(set)];
  }, [news, customCategories]);

  const filteredNews = news.filter((n) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      n.Title?.toLowerCase().includes(q) ||
      n.Author?.toLowerCase().includes(q) ||
      n.Category?.toLowerCase().includes(q);

    const matchCategory = categoryFilter === "ALL" || (n.Category || "") === categoryFilter;
    const matchStatus = statusFilter === "ALL" || n.Status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentNews = filteredNews.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredNews.length / perPage) || 1;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAddNews = () => {
    openModal("add");
  };

  const handleAddCategory = () => {
    const newCategory = prompt("Nhập tên danh mục mới:");
    if (newCategory && newCategory.trim()) {
      const trimmed = newCategory.trim();
      if (categories.includes(trimmed)) {
        setAlert({ type: "warning", message: "Danh mục này đã tồn tại!" });
      } else {
        setCustomCategories([...customCategories, trimmed]);
        setAlert({ type: "success", message: `Đã thêm danh mục "${trimmed}"!` });
      }
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const newsUsingCategory = news.filter((n) => n.Category === categoryToDelete);

    if (newsUsingCategory.length > 0) {
      const confirmDelete = confirm(
        `Có ${newsUsingCategory.length} tin tức đang sử dụng danh mục "${categoryToDelete}".\n\nBạn có chắc muốn xóa?`
      );
      if (!confirmDelete) return;
    }

    const confirmDelete = confirm(`Xóa danh mục "${categoryToDelete}"?`);
    if (confirmDelete) {
      setCustomCategories(customCategories.filter((c) => c !== categoryToDelete));
      setAlert({ type: "success", message: `Đã xóa danh mục "${categoryToDelete}"!` });

      if (categoryFilter === categoryToDelete) {
        setCategoryFilter("ALL");
      }
    }
  };

  const openModal = (mode, newsItem = null) => {
    setModalMode(mode);
    setSelectedNews(newsItem);

    if (newsItem && mode === "edit") {
      setFormData({
        Title: newsItem.Title || "",
        Summary: newsItem.Summary || "",
        Content: newsItem.Content || "",
        Author: newsItem.Author || "",
        NewsPicture: newsItem.NewsPicture || "",
        Category: newsItem.Category || "",
        Status: newsItem.Status || "draft",
      });
    } else if (mode === "add") {
      setFormData({
        Title: "",
        Summary: "",
        Content: "",
        Author: "",
        NewsPicture: "",
        Category: "",
        Status: "draft",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNews(null);
    setFormData({
      Title: "",
      Summary: "",
      Content: "",
      Author: "",
      NewsPicture: "",
      Category: "",
      Status: "draft",
    });
  };

  const handleUpdate = async (opts = {}) => {
    if (saving) return;
    setSaving(true);
    try {
      let pictureUrl = formData.NewsPicture || selectedNews?.NewsPicture || "";

      if (opts?.newImageFile) {
        pictureUrl = opts.newImageFile;
      }

      const res = await api.post("update_news.php", {
        News_ID: selectedNews.News_ID,
        ...formData,
        NewsPicture: pictureUrl,
      });

      if (res.data?.success) {
        setAlert({ type: "success", message: "Cập nhật tin tức thành công!" });
        await fetchNews();
        closeModal();
      } else {
        setAlert({ type: "error", message: res.data?.message || "Cập nhật tin tức thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra khi cập nhật!" });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (opts = {}) => {
    if (saving) return;
    setSaving(true);
    try {
      let pictureUrl = "";

      if (opts?.newImageFile) {
        pictureUrl = opts.newImageFile;
      }

      const res = await api.post("add_news.php", {
        ...formData,
        NewsPicture: pictureUrl,
      });

      if (res.data?.success) {
        setAlert({ type: "success", message: "Thêm tin tức thành công!" });
        await fetchNews();
        closeModal();
      } else {
        setAlert({ type: "error", message: res.data?.message || "Thêm tin tức thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi khi thêm:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra khi thêm!" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.post("delete_news.php", {
        News_ID: selectedNews.News_ID,
      });
      if (res.data?.success) {
        setAlert({ type: "warning", message: "Đã xóa tin tức!" });
        fetchNews();
        closeModal();
      } else {
        setAlert({
          type: "error",
          message: res.data?.message || "Xóa tin tức thất bại!",
        });
      }
    } catch (err) {
      console.error("Lỗi xóa:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra khi xóa!" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 min-h-screen">
      {alert.message && (
        <Notification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <NewsSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          categories={categories}
          totalNews={news.length}
          filteredCount={filteredNews.length}
          onAddNews={handleAddNews}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          customCategories={customCategories}
          news={news}
        />

        <NewsTable
          news={currentNews}
          onViewNews={(n) => openModal("view", n)}
          onEditNews={(n) => openModal("edit", n)}
          onDeleteNews={(n) => openModal("delete", n)}
        />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <NewsModal
        show={showModal}
        mode={modalMode}
        news={selectedNews}
        formData={formData}
        onClose={closeModal}
        onUpdate={modalMode === "add" ? handleAdd : handleUpdate}
        onDelete={handleDelete}
        onFormChange={setFormData}
        categories={categories}
      />
    </div>
  );
}