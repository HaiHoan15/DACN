import React, { useEffect, useState } from "react";
import api from "../../../../../API/api";
import Loading from "../../../_Components/Loading";
import Notification from "../../../_Components/Notification";
import Pagination from "../../../_Components/Pagination";

export default function GetPet({ onSwitch }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const user = JSON.parse(localStorage.getItem("user"));

    // Lấy danh sách thú cưng
    const fetchPets = async () => {
        try {
            const res = await api.get("get_pet_by_user.php", {
                params: { user_id: user.User_ID },
            });
            setPets(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setAlert({ type: "error", message: "Không thể tải danh sách thú cưng!" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-600">Danh sách thú cưng</h2>
                <button
                    onClick={() => onSwitch("add")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    + Thêm thú cưng mới
                </button>
            </div>

            <Notification type={alert.type} message={alert.message} />

            {pets.length === 0 ? (
                <p className="text-center text-gray-500">Chưa có thú cưng nào</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                        <div
                            key={pet.Pet_ID}
                            className="bg-[#fff6ea] rounded-xl shadow-md overflow-hidden border border-orange-200 hover:shadow-lg transition-all"
                        >
                            {/* Ảnh thú cưng */}
                            <div className="h-52 bg-gray-100 flex justify-center items-center overflow-hidden">
                                {pet.PetPicture ? (
                                    <img
                                        src={pet.PetPicture}
                                        alt={pet.PetName}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">Không có ảnh</span>
                                )}
                            </div>

                            {/* Nội dung */}
                            <div className="p-4 text-gray-800">
                                <h3 className="text-lg font-bold text-blue-700 mb-2">
                                    {pet.PetName}
                                </h3>

                                <div className="space-y-1 text-sm">
                                    <p>🎂 Ngày sinh: {formatDate(pet.Birthday)}</p>
                                    <p>📅 Tuổi: {calcAge(pet.Birthday)}</p>
                                </div>

                                {/* Nút hành động */}
                                <div className="flex justify-between mt-4 gap-2">
                                    <button
                                        onClick={() => onSwitch("edit", pet)}
                                        className="flex-1 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => onSwitch("detail", pet)}
                                        className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        onClick={() => onSwitch("delete", pet)}
                                        className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Pagination />
        </div>
    );
}

/* Hàm tính tuổi linh hoạt */
function calcAge(birthDate) {
    if (!birthDate) return "Không rõ";
    const birth = new Date(birthDate);
    const now = new Date();
    const diffMonths =
        (now.getFullYear() - birth.getFullYear()) * 12 +
        (now.getMonth() - birth.getMonth());

    if (diffMonths < 12) {
        return `${diffMonths <= 0 ? 1 : diffMonths} tháng`;
    } else {
        const years = Math.floor(diffMonths / 12);
        return `${years} năm`;
    }
}

/* Định dạng ngày dd/mm/yyyy */
function formatDate(dateStr) {
    if (!dateStr) return "Không rõ";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}
