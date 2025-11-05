import React, { useState } from "react";
import Dashboard from "./DashBoard/Dashboard";
import Profile from "./PageFromUser/Profile";
import Pet from "./PageFromUser/Pet";
import Schedule from "./PageFromUser/Schedule";
import Wishlist from "./PageFromUser/Wishlist";
import Order from "./PageFromUser/Order";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("profile"); // tab mặc định);

  // Hàm hiển thị component tương ứng
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "pet":
        return <Pet />;
      case "schedule":
        return <Schedule />;
      case "wishlist":
        return <Wishlist />;
      case "order":
        return <Order />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Dashboard activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Nội dung tab */}
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
}

