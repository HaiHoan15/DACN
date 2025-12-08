import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./PageFromAdmin/Profile";
import AppointmentApproval from "./PageFromAdmin/AppointmentApproval";
import OrderApproval from "./PageFromAdmin/OrderApproval";
import Statistics from "./PageFromAdmin/Statistics";
import ChatBot from "./PageFromAdmin/ChatBot";

export default function AdminPage() {
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
      case "schedule":
        return <AppointmentApproval />;
      case "order":
        return <OrderApproval />;
      case "statistics":
        return <Statistics />;
      case "chatbot":
        return <ChatBot />;
      default:
        return <Statistics />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Dashboard activeTab={activeTab} onSelectTab={setActiveTab} />
      {/* Nội dung tab */}
      <div 
        className="flex-1 p-8" 
        style={{ backgroundImage: "url('/images/background/user-profile-bg.jpg')" }}
      >
        {renderContent()}
      </div>
    </div>
  );
}