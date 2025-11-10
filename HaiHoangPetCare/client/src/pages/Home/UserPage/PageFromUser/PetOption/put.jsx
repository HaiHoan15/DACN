import React, { useState } from "react";
import api from "../../../../../API/api";
import Notification from "../../../_Components/Notification";
import imageCompression from "browser-image-compression";

export default function EditPet({ pet, onBack }) {
    const [form, setForm] = useState({ ...pet });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [inputErrors, setInputErrors] = useState({});

    const validateInput = (name, value) => {
        if (["PetName"].includes(name) && value.length > 30)
            return "Tên tối đa 30 ký tự.";
        if (["Species", "Breed"].includes(name) && value.length > 50)
            return "Tối đa 50 ký tự.";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const err = validateInput(name, value);
        setInputErrors((prev) => ({ ...prev, [name]: err }));
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800 };
            const compressed = await imageCompression(file, options);
            const base64 = await convertToBase64(compressed);
            setForm((prev) => ({ ...prev, PetPicture: base64 }));
        } catch {
            setAlert({ type: "error", message: "Không thể tải ảnh, thử lại!" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(inputErrors).some((err) => err)) {
            setAlert({ type: "error", message: "Vui lòng kiểm tra lại thông tin." });
            return;
        }

        try {
            const res = await api.post("update_pet.php", form, {
                headers: { "Content-Type": "application/json" },
            });

            if (res.data.success) {
                setAlert({ type: "success", message: "Cập nhật thành công!" });
                setTimeout(onBack, 800);
            } else {
                setAlert({ type: "error", message: res.data.message || "Lỗi cập nhật." });
            }
        } catch {
            setAlert({ type: "error", message: "Không thể kết nối máy chủ!" });
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-orange-600">✏️ Sửa thông tin thú cưng</h2>
            <Notification type={alert.type} message={alert.message} />

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="PetName"
                    placeholder="Tên thú cưng"
                    className="border p-2 w-full rounded"
                    value={form.PetName || ""}
                    onChange={handleChange}
                />
                {inputErrors.PetName && <p className="text-red-500 text-sm">{inputErrors.PetName}</p>}

                <input
                    name="Species"
                    placeholder="Loài"
                    className="border p-2 w-full rounded"
                    value={form.Species || ""}
                    onChange={handleChange}
                />
                {inputErrors.Species && <p className="text-red-500 text-sm">{inputErrors.Species}</p>}

                <input
                    name="Breed"
                    placeholder="Giống"
                    className="border p-2 w-full rounded"
                    value={form.Breed || ""}
                    onChange={handleChange}
                />
                {inputErrors.Breed && <p className="text-red-500 text-sm">{inputErrors.Breed}</p>}

                <select
                    name="Gender"
                    value={form.Gender || "Đực"}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                >
                    <option>Đực</option>
                    <option>Cái</option>
                </select>

                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                    type="date"
                    name="Birthday"
                    value={form.Birthday || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
                {form.Birthday && (
                    <p className="text-sm text-gray-600">
                        🎂 Tuổi hiện tại: <b>{calcAge(form.Birthday)}</b> năm
                    </p>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border p-2 w-full rounded"
                />
                {form.PetPicture && (
                    <img
                        src={form.PetPicture}
                        alt="preview"
                        className="w-28 h-28 mt-2 rounded-full border object-cover"
                    />
                )}

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
}

function calcAge(birthDate) {
    if (!birthDate) return "Không rõ";
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
