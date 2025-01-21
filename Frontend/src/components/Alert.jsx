import React, { createContext, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create the Alert Context
const AlertContext = createContext();

// Alert Provider to manage alerts globally
export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    message: "",
  });

  const triggerAlert = (type, title, message, duration = 5000) => {
    setAlertConfig({ type, title, message });
    
    // Trigger toast notifications based on alert type
    switch (type) {
      case "info":
        toast.info(message, { autoClose: duration });
        break;
      case "success":
        toast.success(message, { autoClose: duration });
        break;
      case "error":
        toast.error(message, { autoClose: duration });
        break;
      case "warning":
        toast.warn(message, { autoClose: duration });
        break;
      default:
        toast(message, { autoClose: duration });
    }
  };

  return (
    <AlertContext.Provider value={{ alertConfig, triggerAlert }}>
      {children}
      {/* ToastContainer is needed to display the toast notifications */}
      <ToastContainer />
    </AlertContext.Provider>
  );
};

// Custom hook to use Alert
export const useAlert = () => {
  return useContext(AlertContext);
};
