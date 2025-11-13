import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import Loading from "../_Components/Loading";
import Notification from "../_Components/Notification";
import Pagination from "../_Components/Pagination";
import UserSearchBar from "./UserOptions/UserSearchBar";
import UserTable from "./UserOptions/UserTable";
import UserModal from "./UserOptions/UserModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // Thêm state lọc vai trò
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [formData, setFormData] = useState({
    Fullname: "",
    Email: "",
    Phone: "",
    Address: "",
    Birthday: "",
    Role: "KH",
  });

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("get_all_users.php");
      console.log("Response data:", res.data);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải users:", err);
      setAlert({ type: "error", message: "Không thể tải danh sách người dùng!" });
    } finally {
      setLoading(false);
    }
  };

  // Lọc users theo tìm kiếm VÀ vai trò
  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      user.Fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Phone?.includes(searchTerm);
    
    const matchRole = roleFilter === "ALL" || user.Role === roleFilter;
    
    return matchSearch && matchRole;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (user && mode === "edit") {
      setFormData({
        Fullname: user.Fullname || "",
        Email: user.Email || "",
        Phone: user.Phone || "",
        Address: user.Address || "",
        Birthday: user.Birthday || "",
        Role: user.Role || "KH",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      Fullname: "",
      Email: "",
      Phone: "",
      Address: "",
      Birthday: "",
      Role: "KH",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.post("update_user.php", {
        User_ID: selectedUser.User_ID,
        ...formData,
      });
      if (res.data.success) {
        setAlert({ type: "success", message: "Cập nhật người dùng thành công!" });
        fetchUsers();
        closeModal();
      } else {
        setAlert({ type: "error", message: res.data.message || "Cập nhật thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setAlert({ type: "error", message: "Có lỗi xảy ra khi cập nhật!" });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.post("delete_user.php", {
        User_ID: selectedUser.User_ID,
      });
      if (res.data.success) {
        setAlert({ type: "warning", message: "Đã xóa người dùng!" });
        fetchUsers();
        closeModal();
      } else {
        setAlert({ type: "error", message: res.data.message || "Xóa thất bại!" });
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
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
        <UserSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />

        <UserTable
          users={currentUsers}
          onViewUser={(user) => openModal("view", user)}
          onEditUser={(user) => openModal("edit", user)}
          onDeleteUser={(user) => openModal("delete", user)}
        />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <UserModal
        show={showModal}
        mode={modalMode}
        user={selectedUser}
        formData={formData}
        onClose={closeModal}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onFormChange={setFormData}
      />
    </div>
  );
}