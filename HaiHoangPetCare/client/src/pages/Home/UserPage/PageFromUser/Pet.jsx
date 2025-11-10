import React, { useState } from "react";
import GetPet from "./PetOption/get";
import AddPet from "./PetOption/add";
import EditPet from "./PetOption/put";
import DeletePet from "./PetOption/delete";
import DetailPet from "./PetOption/detail";

export default function Pet() {
  const [activeTab, setActiveTab] = useState("get");
  const [selectedPet, setSelectedPet] = useState(null);

  const handleSwitch = (tab, pet = null) => {
    setSelectedPet(pet);
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <AddPet onBack={() => setActiveTab("get")} />;
      case "edit":
        return <EditPet pet={selectedPet} onBack={() => setActiveTab("get")} />;
      case "delete":
        return <DeletePet pet={selectedPet} onBack={() => setActiveTab("get")} />;
      case "detail":
        return <DetailPet pet={selectedPet} onBack={() => setActiveTab("get")} />;
      default:
        return <GetPet onSwitch={handleSwitch} />;
    }
  };

  return <div>{renderContent()}</div>;
}
