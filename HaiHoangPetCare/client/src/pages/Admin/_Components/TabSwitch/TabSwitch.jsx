import React from "react";

export default function TabSwitch({ tabs, activeTab, onTabChange }) {
  return (
    <div className="relative flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1 shadow-md border border-gray-300">
      {/* Indicator */}
      <div
        className="absolute h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out shadow-lg"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${(100 / tabs.length) * tabs.findIndex((t) => t.id === activeTab)}%`,
        }}
      />

      {/* Tabs */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative z-10 flex-1 h-9 flex items-center justify-center text-sm font-semibold transition-all duration-300 rounded-lg ${
            activeTab === tab.id 
              ? "text-white" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
