import React, { useState, useLayoutEffect } from "react";
import RegistrarSidebar from "./RegistrarSidebar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const RegistrarDashboard = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
     const handleResize = () => setIsMobile(window.innerWidth <= 768);
     window.addEventListener("resize", handleResize);
     handleResize();
     return () => window.removeEventListener("resize", handleResize);
   }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0]">
      {/* Sidebar */}
      <RegistrarSidebar
        onLogout={onLogout}
        currentPage="dashboard"
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onNavigate={(section) => {
          switch (section) {
            case "logout":
              navigate("/registrar");
              break;
            case "enroll":
              navigate("/registrar/enroll");
              break;
            case "list":
              navigate("/registrar/list");
              break;
            case "account":
              navigate("/registrar/account");
              break;
            default:
              break;
          }
        }}
        // Hide sidebar on mobile view
        className={isMobile ? "sidebar-collapsed" : ""}
      />

      {/* Main Content */}
      <Dashboard />
    </div>
  );
};

export default RegistrarDashboard;
