import React, { useEffect, useState } from "react";
import api from "../../../../../API/api";
import Loading from "../../../_Components/Loading";
import Notification from "../../../_Components/Notification";

export default function GetPet({ onSwitch }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const petsPerPage = 6;

    // Lấy danh sách thú cưng
    const fetchPets = async () => {
        try {
            const res = await api.get("get_pet_by_user.php", {
                params: { user_id: user.User_ID },
            });
            setPets(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải thú cưng:", err);
            setAlert({ type: "error", message: "Không thể tải danh sách thú cưng!" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    // Tìm kiếm
    const filteredPets = pets.filter((pet) =>
        pet.PetName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const indexOfLastPet = currentPage * petsPerPage;
    const indexOfFirstPet = indexOfLastPet - petsPerPage;
    const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
    const totalPages = Math.ceil(filteredPets.length / petsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen rounded-2xl">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        {/* Title */}
                        <div className="flex-shrink-0">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                                Danh sách thú cưng
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {searchTerm ? (
                                    <>
                                        Tìm thấy:{" "}
                                        <span className="font-semibold text-blue-600">
                                            {filteredPets.length}
                                        </span>{" "}
                                        / {pets.length} thú cưng
                                    </>
                                ) : (
                                    <>
                                        Tổng cộng:{" "}
                                        <span className="font-semibold text-blue-600">
                                            {pets.length}
                                        </span>{" "}
                                        thú cưng
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Tìm kiếm */}
                        <div className="flex-grow max-w-md w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên thú cưng..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />

                                {/* Icon search */}
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>

                                {/* Clear search */}
                                {searchTerm && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Nút thêm */}
                        <button
                            onClick={() => onSwitch("add")}
                            className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg 
              hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            + Thêm thú cưng mới
                        </button>
                    </div>
                </div>

                <Notification type={alert.type} message={alert.message} />

                {/* Không có thú cưng */}
                {filteredPets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">{searchTerm ? "🔍" : "🐶"}</div>

                        <p className="text-gray-500 text-lg">
                            {searchTerm
                                ? `Không tìm thấy thú cưng nào với tên "${searchTerm}"`
                                : "Chưa có thú cưng nào"}
                        </p>

                        <p className="text-gray-400 text-sm mt-2">
                            {searchTerm
                                ? "Thử tìm kiếm với từ khóa khác"
                                : "Hãy thêm thú cưng đầu tiên của bạn!"}
                        </p>

                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                }}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Xóa tìm kiếm
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* GRID thú cưng */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentPets.map((pet) => (
                                <div
                                    key={pet.Pet_ID}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-transparent hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                                >
                                    {/* Ảnh */}
                                    <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center overflow-hidden relative">
                                        {pet.PetPicture ? (
                                            <>
                                                <img
                                                    src={pet.PetPicture}
                                                    alt={pet.PetName}
                                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <span className="text-6xl opacity-30">🐾</span>
                                                <p className="text-gray-400 text-sm mt-2">Không có ảnh</p>
                                            </div>
                                        )}

                                        {/* Badge giới tính */}
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${pet.Gender === "Đực"
                                                        ? "bg-blue-500"
                                                        : "bg-pink-500"
                                                    }`}
                                            >
                                                {pet.Gender === "Đực" ? "♂️ Đực" : "♀️ Cái"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Nội dung */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                            {pet.PetName}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <p>
                                                <b>Loài:</b> {pet.Species || "Không rõ"}
                                            </p>
                                            <p>
                                                <b>Tuổi:</b> {calcAge(pet.Birthday)}
                                            </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => onSwitch("detail", pet)}
                                                className="py-2 px-3 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition shadow-sm"
                                            >
                                                Chi tiết
                                            </button>
                                            <button
                                                onClick={() => onSwitch("edit", pet)}
                                                className="py-2 px-3 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition shadow-sm"
                                            >
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={() => onSwitch("delete", pet)}
                                                className="py-2 px-3 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex flex-wrap justify-center items-center gap-2">
                                    {/* Previous */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                            }`}
                                    >
                                        ← Trước
                                    </button>

                                    {/* Page numbers */}
                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    {/* Next */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                            }`}
                                    >
                                        Sau →
                                    </button>
                                </div>

                                {/* Info */}
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    Trang{" "}
                                    <span className="font-semibold text-blue-600">
                                        {currentPage}
                                    </span>{" "}
                                    / {totalPages}
                                    <span className="mx-2">•</span>
                                    Hiển thị{" "}
                                    <span className="font-semibold">{indexOfFirstPet + 1}</span> -{" "}
                                    <span className="font-semibold">
                                        {Math.min(indexOfLastPet, filteredPets.length)}
                                    </span>{" "}
                                    trong tổng số{" "}
                                    <span className="font-semibold">{filteredPets.length}</span>{" "}
                                    {searchTerm && "kết quả"}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* Tính tuổi */
function calcAge(birthDate) {
    if (!birthDate) return "Không rõ";

    const birth = new Date(birthDate);
    const now = new Date();

    const diffMonths =
        (now.getFullYear() - birth.getFullYear()) * 12 +
        (now.getMonth() - birth.getMonth());

    if (diffMonths < 1) return "Dưới 1 tháng";
    if (diffMonths < 12) return `${diffMonths} tháng tuổi`;

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    return months > 0
        ? `${years} tuổi ${months} tháng`
        : `${years} tuổi`;
}
