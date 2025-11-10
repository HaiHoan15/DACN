import React, { useState } from "react";
import api from "../../../../../API/api";
import Notification from "../../../_Components/Notification";
import imageCompression from "browser-image-compression";

export default function AddPet({ onBack }) {
    const [form, setForm] = useState({
        PetName: "",
        Species: "",
        Breed: "",
        Gender: "Đực",
        Birthday: "",
        PetPicture: "",
    });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [inputErrors, setInputErrors] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));

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

        // Nếu có lỗi nhập liệu
        if (Object.values(inputErrors).some((err) => err)) {
            setAlert({ type: "error", message: "Vui lòng kiểm tra lại thông tin." });
            return;
        }

        try {
            const payload = { ...form, User_ID: user.User_ID };
            const res = await api.post("add_pet.php", payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (res.data.success) {
                setAlert({ type: "success", message: "Đã thêm thú cưng thành công!" });
                setTimeout(onBack, 800);
            } else {
                setAlert({ type: "error", message: res.data.message || "Lỗi khi thêm." });
            }
        } catch {
            setAlert({ type: "error", message: "Không thể kết nối máy chủ!" });
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-600">🐕 Thêm thú cưng mới</h2>
            <Notification type={alert.type} message={alert.message} />

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="PetName"
                    placeholder="Tên thú cưng"
                    className="border p-2 w-full rounded"
                    value={form.PetName}
                    onChange={handleChange}
                />
                {inputErrors.PetName && <p className="text-red-500 text-sm">{inputErrors.PetName}</p>}

                <input
                    name="Species"
                    placeholder="Loài"
                    className="border p-2 w-full rounded"
                    value={form.Species}
                    onChange={handleChange}
                />
                {inputErrors.Species && <p className="text-red-500 text-sm">{inputErrors.Species}</p>}

                <input
                    name="Breed"
                    placeholder="Giống"
                    className="border p-2 w-full rounded"
                    value={form.Breed}
                    onChange={handleChange}
                />
                {inputErrors.Breed && <p className="text-red-500 text-sm">{inputErrors.Breed}</p>}

                <select
                    name="Gender"
                    value={form.Gender}
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
                    value={form.Birthday}
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Lưu
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
