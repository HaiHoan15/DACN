import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./DashBoard/Dashboard";
import Profile from "./PageFromUser/Profile";
import Pet from "./PageFromUser/Pet";
import Schedule from "./PageFromUser/Schedule";
import Wishlist from "./PageFromUser/Wishlist";
import Order from "./PageFromUser/Order";

export default function UserPage() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");

  // Cập nhật activeTab khi URL thay đổi
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Hàm hiển thị component tương ứng
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "pet":
        return <Pet />;
      case "schedule":
        return <Schedule />;
      case "cart":
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
      <div className="flex-1 p-8" 
      style={{ backgroundImage: "url('/images/background/user-profile-bg.jpg')" }}
      >{renderContent()}</div>
    </div>
  );
}

