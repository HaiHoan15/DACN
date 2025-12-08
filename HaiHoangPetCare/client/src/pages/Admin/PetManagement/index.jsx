import React, { useEffect, useState } from "react";
import api from "../../../API/api";
import Loading from "../_Components/Loading";
import Notification from "../_Components/Notification";
import Pagination from "../_Components/Pagination";
import PetSearchBar from "./PetOptions/PetSearchBar";
import PetTable from "./PetOptions/PetTable";
import PetModal from "./PetOptions/PetModal";

export default function PetManagement() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [formData, setFormData] = useState({
    PetName: "",
    Species: "",
    Breed: "",
    Gender: "Đực",
    Birthday: "",
  });

  const petsPerPage = 10;

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await api.get("get_all_pets.php");
      console.log("Response data:", res.data);
      setPets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải pets:", err);
      setAlert({ type: "error", message: "Không thể tải danh sách thú cưng!" });
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter((pet) => {
    const matchSearch = 
      pet.PetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.Species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.Breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchOwner = 
      !ownerSearch || 
      pet.OwnerName?.toLowerCase().includes(ownerSearch.toLowerCase());
    
    const matchGender = genderFilter === "ALL" || pet.Gender === genderFilter;
    
    return matchSearch && matchOwner && matchGender;
  });

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOwnerSearchChange = (e) => {
    setOwnerSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleGenderFilterChange = (gender) => {
    setGenderFilter(gender);
    setCurrentPage(1);
  };

  const openModal = (mode, pet = null) => {
    setModalMode(mode);
    setSelectedPet(pet);
    if (pet && mode === "edit") {
      setFormData({
        PetName: pet.PetName || "",
        Species: pet.Species || "",
        Breed: pet.Breed || "",
        Gender: pet.Gender || "Đực",
        Birthday: pet.Birthday || "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
    setFormData({
      PetName: "",
      Species: "",
      Breed: "",
      Gender: "Đực",
      Birthday: "",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.post("update_pet.php", {
        Pet_ID: selectedPet.Pet_ID,
        ...formData,
      });
      if (res.data.success) {
        setAlert({ type: "success", message: "Cập nhật thú cưng thành công!" });
        fetchPets();
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
      const res = await api.post("delete_pet.php", {
        Pet_ID: selectedPet.Pet_ID,
      });
      if (res.data.success) {
        setAlert({ type: "warning", message: "Đã xóa thú cưng!" });
        fetchPets();
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
        <PetSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          ownerSearch={ownerSearch}
          onOwnerSearchChange={handleOwnerSearchChange}
          genderFilter={genderFilter}
          onGenderFilterChange={handleGenderFilterChange}
          totalPets={pets.length}
          filteredCount={filteredPets.length}
        />

        <PetTable
          pets={currentPets}
          onViewPet={(pet) => openModal("view", pet)}
          onEditPet={(pet) => openModal("edit", pet)}
          onDeletePet={(pet) => openModal("delete", pet)}
        />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <PetModal
        show={showModal}
        mode={modalMode}
        pet={selectedPet}
        formData={formData}
        onClose={closeModal}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onFormChange={setFormData}
      />
    </div>
  );
}