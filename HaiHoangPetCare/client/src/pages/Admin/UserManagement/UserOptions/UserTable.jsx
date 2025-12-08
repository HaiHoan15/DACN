import React from "react";

export default function UserTable({ users, onViewUser, onEditUser, onDeleteUser }) {
    const getRoleText = (role) => {
        switch (role) {
            case "BS":
                return "Admin";
            case "KH":
                return "Khách hàng";
            default:
                return role;
        }
    };

    const getRoleBadge = (role) => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
        switch (role) {
            case "BS":
                return `${baseClass} bg-purple-100 text-purple-700`;
            case "KH":
                return `${baseClass} bg-blue-100 text-blue-700`;
            default:
                return `${baseClass} bg-gray-100 text-gray-700`;
        }
    };

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
                <p className="text-gray-500 text-lg">Không tìm thấy người dùng nào</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Ảnh</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Họ tên</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Vai trò</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr
                                key={user.User_ID}
                                className="hover:bg-blue-50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <img
                                        src={user.UserPicture || "/images/user.png"}
                                        alt={user.Fullname}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/user.png";
                                        }}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {user.Fullname}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {user.Email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={getRoleBadge(user.Role)}>
                                        {getRoleText(user.Role)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onViewUser(user)}
                                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                            title="Xem chi tiết"
                                        >
                                            Xem
                                        </button>
                                        <button
                                            onClick={() => onEditUser(user)}
                                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                                            title="Chỉnh sửa"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => onDeleteUser(user)}
                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                                            title="Xóa"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}