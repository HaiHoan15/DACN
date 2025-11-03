import React from "react";
import {
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

/**
 * Notification component dùng chung
 * @param {string} type - "success" | "error" | "warning"
 * @param {string} message - nội dung hiển thị
 */
export default function Notification({ type, message }) {
  if (!message) return null;

  const styles = {
    success:
      "bg-green-50 text-green-800 border border-green-300 dark:bg-gray-800 dark:text-green-400",
    error:
      "bg-red-50 text-red-800 border border-red-300 dark:bg-gray-800 dark:text-red-400",
    warning:
      "bg-yellow-50 text-yellow-800 border border-yellow-300 dark:bg-gray-800 dark:text-yellow-300",
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 mr-2" />,
    error: <XCircleIcon className="w-5 h-5 mr-2" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 mr-2" />,
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm rounded-lg ${styles[type]}`}
      role="alert"
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
}
