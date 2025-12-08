import React, { useEffect, useMemo, useState } from "react";

import api from "../../../API/api";
import Loading from "../_Components/Loading";
import Notification from "../_Components/Notification";
import Pagination from "../_Components/Pagination";
import ProductSearchBar from "./ProductOptions/ProductSearchBar";
import ProductTable from "./ProductOptions/ProductTable";
import ProductModal from "./ProductOptions/ProductModal";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Load customCategories từ localStorage
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem("customProductCategories");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    ProductName: "",
    Description: "",
    Price: "",
    Supplier: "",
    ProductPicture: "",
    Category: "",
  });

  const perPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lưu customCategories vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("customProductCategories", JSON.stringify(customCategories));
  }, [customCategories]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("get_all_products.php");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải products:", err);
      setAlert({ type: "error", message: "Không thể tải danh sách sản phẩm!" });
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const c = (p.Category || "").trim();
      if (c) set.add(c);
    });
    customCategories.forEach((c) => set.add(c));
    return ["ALL", ...Array.from(set)];
  }, [products, customCategories]);

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      p.ProductName?.toLowerCase().includes(q) ||
      p.Supplier?.toLowerCase().includes(q) ||
      p.Category?.toLowerCase().includes(q) ||
      String(p.Price ?? "").includes(q);

    const matchCategory =
      categoryFilter === "ALL" || (p.Category || "") === categoryFilter;

    return matchSearch && matchCategory;
  });

  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentProducts = filteredProducts.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredProducts.length / perPage) || 1;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleAddProduct = () => {
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
    const productsUsingCategory = products.filter((p) => p.Category === categoryToDelete);

    if (productsUsingCategory.length > 0) {
      const confirmDelete = confirm(
        `Có ${productsUsingCategory.length} sản phẩm đang sử dụng danh mục "${categoryToDelete}".\n\nBạn có chắc muốn xóa?`
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

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);

    if (product && mode === "edit") {
      setFormData({
        ProductName: product.ProductName || "",
        Description: product.Description || "",
        Price: product.Price ?? "",
        Supplier: product.Supplier || "",
        ProductPicture: product.ProductPicture || "",
        Category: product.Category || "",
      });
    } else if (mode === "add") {
      setFormData({
        ProductName: "",
        Description: "",
        Price: "",
        Supplier: "",
        ProductPicture: "",
        Category: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setFormData({
      ProductName: "",
      Description: "",
      Price: "",
      Supplier: "",
      ProductPicture: "",
      Category: "",
    });
  };

  const handleUpdate = async (opts = {}) => {
    if (saving) return;
    setSaving(true);
    try {
      let pictureUrl = formData.ProductPicture || selectedProduct?.ProductPicture || "";

      if (opts?.newImageFile) {
        pictureUrl = opts.newImageFile;
      }

      const res = await api.post("update_product.php", {
        Product_ID: selectedProduct.Product_ID,
        ...formData,
        ProductPicture: pictureUrl,
      });

      if (res.data?.success) {
        setAlert({ type: "success", message: "Cập nhật sản phẩm thành công!" });
        await fetchProducts();
        closeModal();
      } else {
        setAlert({ type: "error", message: res.data?.message || "Cập nhật sản phẩm thất bại!" });
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

      const res = await api.post("add_product.php", {
        ...formData,
        ProductPicture: pictureUrl,
      });

      if (res.data?.success) {
        setAlert({ type: "success", message: "Thêm sản phẩm thành công!" });
        await fetchProducts();
        closeModal();
      } else {
        setAlert({ type: "error", message: res.data?.message || "Thêm sản phẩm thất bại!" });
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
      const res = await api.post("delete_product.php", {
        Product_ID: selectedProduct.Product_ID,
      });
      if (res.data?.success) {
        setAlert({ type: "warning", message: "Đã xóa sản phẩm!" });
        fetchProducts();
        closeModal();
      } else {
        setAlert({
          type: "error",
          message: res.data?.message || "Xóa sản phẩm thất bại!",
        });
      }
    } catch (err) {
      console.error("Lỗi xóa:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra khi xóa!" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {alert.message && (
        <Notification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <ProductSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
          onAddProduct={handleAddProduct}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          customCategories={customCategories}
          products={products}
        />

        <ProductTable
          products={currentProducts}
          onViewProduct={(p) => openModal("view", p)}
          onEditProduct={(p) => openModal("edit", p)}
          onDeleteProduct={(p) => openModal("delete", p)}
        />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <ProductModal
        show={showModal}
        mode={modalMode}
        product={selectedProduct}
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