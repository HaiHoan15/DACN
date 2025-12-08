import React, { useState } from "react";
import api from "../../../../../API/api";
import Notification from "../../../_Components/Notification";
import imageCompression from "browser-image-compression";

export default function EditPet({ pet, onBack }) {
    const [form, setForm] = useState({ ...pet });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [inputErrors, setInputErrors] = useState({});

    // Lấy ngày hôm nay ở định dạng YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const validateInput = (name, value) => {
        if (["PetName"].includes(name) && value.length > 30)
            return "Tên tối đa 30 ký tự.";
        if (["Species", "Breed"].includes(name) && value.length > 50)
            return "Tối đa 50 ký tự.";
        if (name === "Birthday" && value > today)
            return "Ngày sinh không được sau hôm nay.";
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

        // Validate tất cả các trường trước khi submit
        const errors = {
            PetName: validateInput("PetName", form.PetName),
            Species: validateInput("Species", form.Species),
            Breed: validateInput("Breed", form.Breed),
            Birthday: validateInput("Birthday", form.Birthday),
        };

        // Kiểm tra các trường bắt buộc
        if (!form.PetName?.trim()) errors.PetName = "Vui lòng nhập tên thú cưng.";
        if (!form.Species?.trim()) errors.Species = "Vui lòng nhập loài.";
        if (!form.Birthday) errors.Birthday = "Vui lòng chọn ngày sinh.";

        setInputErrors(errors);

        if (Object.values(errors).some((err) => err)) {
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
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-orange-500">
                    <div className="flex items-center gap-3">
                        
                        <div>
                            <h2 className="text-2xl font-bold text-orange-600">Chỉnh sửa thông tin thú cưng</h2>
                            <p className="text-sm text-gray-800">Cập nhật thông tin của - {pet.PetName}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-b-2xl shadow-lg p-8">
                    <Notification type={alert.type} message={alert.message} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Upload ảnh - Nổi bật ở đầu */}
                        <div className="flex flex-col items-center pb-6 border-b">
                            <label className="text-sm font-semibold mb-3 text-gray-700">Ảnh đại diện</label>

                            <div className="relative group">
                                {/* Avatar hiển thị */}
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-dashed border-gray-300 group-hover:border-orange-500 transition-all bg-gray-50 flex items-center justify-center">
                                    {form.PetPicture ? (
                                        <img
                                            src={form.PetPicture}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <span className="text-4xl">📷</span>
                                            <p className="text-xs text-gray-500 mt-1">Tải ảnh lên</p>
                                        </div>
                                    )}
                                </div>

                                {/* Nút upload overlay */}
                                <label
                                    htmlFor="pet-avatar-upload"
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-orange-600 transition transform hover:scale-110"
                                >
                                    <span className="text-xl text-white">+</span>
                                </label>

                                <input
                                    id="pet-avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Nhấn để thay đổi ảnh (tối đa 500KB)</p>
                        </div>

                        {/* Grid 2 cột cho desktop */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Tên thú cưng */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên thú cưng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="PetName"
                                    placeholder="VD: Milu, Lu Lu..."
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${inputErrors.PetName ? "border-red-500" : "border-gray-200"
                                        }`}
                                    value={form.PetName || ""}
                                    onChange={handleChange}
                                />
                                {inputErrors.PetName && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {inputErrors.PetName}
                                    </p>
                                )}
                            </div>

                            {/* Loài */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Loài <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="Species"
                                    placeholder="VD: Chó, Mèo..."
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${inputErrors.Species ? "border-red-500" : "border-gray-200"
                                        }`}
                                    value={form.Species || ""}
                                    onChange={handleChange}
                                />
                                {inputErrors.Species && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {inputErrors.Species}
                                    </p>
                                )}
                            </div>

                            {/* Giống */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giống
                                </label>
                                <input
                                    name="Breed"
                                    placeholder="VD: Corgi, Alaska..."
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${inputErrors.Breed ? "border-red-500" : "border-gray-200"
                                        }`}
                                    value={form.Breed || ""}
                                    onChange={handleChange}
                                />
                                {inputErrors.Breed && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {inputErrors.Breed}
                                    </p>
                                )}
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giới tính
                                </label>
                                <select
                                    name="Gender"
                                    value={form.Gender || "Đực"}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition bg-white"
                                >
                                    <option value="Đực">♂️ Đực</option>
                                    <option value="Cái">♀️ Cái</option>
                                </select>
                            </div>

                            {/* Ngày sinh */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="Birthday"
                                    value={form.Birthday || ""}
                                    onChange={handleChange}
                                    max={today}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${inputErrors.Birthday ? "border-red-500" : "border-gray-200"
                                        }`}
                                />
                                {inputErrors.Birthday && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {inputErrors.Birthday}
                                    </p>
                                )}
                                {form.Birthday && !inputErrors.Birthday && (
                                    <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-sm text-orange-700 font-medium">
                                            Tuổi hiện tại: <b>{calcAge(form.Birthday)}</b>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all shadow-sm"
                            >
                                ← Quay lại
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

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
    return months > 0 ? `${years} tuổi ${months} tháng` : `${years} tuổi`;
}