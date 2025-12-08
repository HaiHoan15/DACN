import React, { useState } from "react";
import api from "../../../../../API/api";
import Notification from "../../../_Components/Notification";

export default function DeletePet({ pet, onBack }) {
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await api.get("delete_pet.php", {
                params: { pet_id: pet.Pet_ID },
            });
            if (res.data.success) {
                setAlert({ type: "success", message: "Xóa thú cưng thành công!" });
                setTimeout(onBack, 800);
            } else {
                setAlert({ type: "error", message: res.data.message || "Không thể xóa." });
            }
        } catch {
            setAlert({ type: "error", message: "Không thể kết nối máy chủ!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Xác nhận xóa thú cưng</h2>
            <Notification type={alert.type} message={alert.message} />

            <img
                src={pet.PetPicture || "/images/pet-default.png"}
                alt={pet.PetName}
                className="w-32 h-32 mx-auto rounded-full border object-cover mb-3"
            />

            <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa <b>{pet.PetName}</b> khỏi danh sách không?
            </p>

            <div className="flex justify-center gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                    Hủy
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Đang xóa..." : "Xóa"}
                </button>
            </div>
        </div>
    );
}
