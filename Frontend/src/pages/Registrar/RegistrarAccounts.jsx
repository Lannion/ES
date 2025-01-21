import React, { useState, useLayoutEffect } from "react";
import RegistrarSidebar from "./RegistrarSidebar";
import { useNavigate } from "react-router-dom";
import Account from "../../components/Account";

const RegistrarAccounts = ({ onLogout }) => {
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
        currentPage="account"
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isCollapsed={isSidebarCollapsed}

        // Hide sidebar on mobile view
        className={isMobile ? "sidebar-collapsed" : ""}
      />

      {/* Main Content */}
      <Account />
    </div>
  );
};

export default RegistrarAccounts;