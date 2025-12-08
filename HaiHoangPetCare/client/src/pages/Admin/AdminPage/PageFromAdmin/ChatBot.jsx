import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import Pagination from "../../_Components/Pagination"; 

export default function ChatBot() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    species: "",
    breed: "",
    symptoms: "",
    diagnosis: "",
    treatment: ""
  });

  //  STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load dữ liệu từ backend
  useEffect(() => {
    fetchData();
  }, []);

  // Tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.treatment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }

    setCurrentPage(1); // reset về trang 1 khi filter
  }, [searchTerm, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://haihoanpetcare.online/petcare_api/get_ai_knowledge.php");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setFilteredData(result.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert("Lỗi khi tải dữ liệu: " + error.message);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      species: "",
      breed: "",
      symptoms: "",
      diagnosis: "",
      treatment: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      species: item.species,
      breed: item.breed,
      symptoms: item.symptoms,
      diagnosis: item.diagnosis,
      treatment: item.treatment
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi này?")) return;

    try {
      const response = await fetch("https://haihoanpetcare.online/petcare_api/delete_ai_knowledge.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const result = await response.json();
      if (result.success) {
        alert("Xóa thành công!");
        fetchData();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Lỗi khi xóa dữ liệu: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingItem
      ? "https://haihoanpetcare.online/petcare_api/update_ai_knowledge.php"
      : "https://haihoanpetcare.online/petcare_api/add_ai_knowledge.php";

    const payload = editingItem
      ? { ...formData, id: editingItem.id }
      : formData;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        alert(editingItem ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Lỗi khi lưu dữ liệu: " + error.message);
    }
  };

  // Import Excel
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map(row => ({
          species: row['Loài'] || row['species'] || "",
          breed: row['Giống'] || row['breed'] || "",
          symptoms: row['Triệu chứng'] || row['symptoms'] || "",
          diagnosis: row['Chuẩn đoán'] || row['diagnosis'] || "",
          treatment: row['Điều trị'] || row['treatment'] || ""
        }));

        const response = await fetch("https://haihoanpetcare.online/petcare_api/import_ai_knowledge.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: formattedData })
        });

        const result = await response.json();
        if (result.success) {
          alert(`Import thành công ${result.count} bản ghi!`);
          fetchData();
        } else {
          alert("Lỗi khi import: " + result.message);
        }
      } catch (error) {
        alert("Lỗi khi đọc file Excel!");
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      'Loài': item.species,
      'Giống': item.breed,
      'Triệu chứng': item.symptoms,
      'Chuẩn đoán': item.diagnosis,
      'Điều trị': item.treatment
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AI Knowledge');
    XLSX.writeFile(workbook, `AI_Knowledge_${new Date().getTime()}.xlsx`);
  };

  // TÍNH PHÂN TRANG
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* HEADER */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Quản lý Dữ liệu AI</h1>
          <p className="text-gray-600">Quản lý kiến thức về bệnh thú cưng cho AI tư vấn</p>
        </div>

        {/* TOOLBAR */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Tìm kiếm theo loài, giống, triệu chứng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Thêm mới
              </button>

              <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
                Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STT</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Loài</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giống</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Triệu chứng</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Chuẩn đoán</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Điều trị</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{item.species}</td>
                        <td className="px-4 py-3 text-sm">{item.breed}</td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate" title={item.symptoms}>
                          {item.symptoms}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate" title={item.diagnosis}>
                          {item.diagnosis}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate" title={item.treatment}>
                          {item.treatment}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 mr-2"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-height-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? "Chỉnh sửa dữ liệu" : "Thêm dữ liệu mới"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loài <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.species}
                      onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Chó, Mèo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giống <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Poodle, Persian"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Triệu chứng <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả các triệu chứng..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chuẩn đoán <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Chuẩn đoán bệnh..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điều trị <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phương pháp điều trị..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingItem ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* THỐNG KÊ */}
        <div className="mt-6 p-4 border-t">
          <p className="text-sm text-gray-600">
            Tổng số bản ghi:
            {" "}
            <span className="font-semibold text-blue-600">{filteredData.length}</span>
            {searchTerm && ` / ${data.length}`}
          </p>
        </div>

        {/* PHÂN TRANG */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

      </div>
    </div>
  );
}
