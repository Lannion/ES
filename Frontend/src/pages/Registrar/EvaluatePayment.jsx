import React, { useState, useLayoutEffect } from "react";
import RegistrarSidebar from "./RegistrarSidebar";
import { useNavigate } from "react-router-dom";

const EvaluatePayment = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [receivedMoney, setReceivedMoney] = useState("");
  const [applyFreeTuition, setApplyFreeTuition] = useState(false);
  const navigate = useNavigate();

  const totalAmount = 8290.0;
  const amountNeeded = applyFreeTuition ? 0 : totalAmount;
  const change = Math.max(0, receivedMoney - amountNeeded).toFixed(2);

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleConfirmEnrollment = () => {
    navigate("/registrar/certificate-of-registration");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0]">
      {/* Sidebar */}
      <RegistrarSidebar
        onLogout={onLogout}
        currentPage="evaluate-payment"
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={setIsSidebarCollapsed}
        className={isMobile ? "sidebar-collapsed" : ""}
      />

      {/* Centered Content */}
      <div
        className={`flex flex-1 flex-col items-center justify-center transition-all duration-300 ${
          isSidebarCollapsed ? "ml-[5rem]" : "ml-[15.625rem]"
        } p-8`}
      >
        <div className="w-full max-w-[80rem] flex flex-col items-center justify-center text-center">
          {/* Header */}
          <h1 className="text-[2rem] font-bold text-gray-800 mb-8">BILLING</h1>

          {/* Cards Section Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[50rem]">
            {/* Lab Fees */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Lab Fees
              </h2>
              <p className="text-sm text-gray-600">Com. Lab: P800.00</p>
            </div>

            {/* Assessment */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Assessment
              </h2>
              <p className="text-sm text-gray-600">Tuition Fee: P3200.00</p>
              <p className="text-sm text-gray-600">SFDF: P1500.00</p>
              <p className="text-sm text-gray-600">SRF: P2025.00</p>
              <p className="text-sm text-gray-600">Misc.: P435.00</p>
              <p className="text-sm text-gray-600">Athletics Fee: P100.00</p>
            </div>

            {/* Other Fees */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Other Fees
              </h2>
              <p className="text-sm text-gray-600">NSTP: P0.00</p>
              <p className="text-sm text-gray-600">Reg. Fee: P55.00</p>
              <p className="text-sm text-gray-600">ID: P0.00</p>
              <p className="text-sm text-gray-600">Late Reg: P0.00</p>
            </div>

            {/* Total Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Total Summary
              </h2>
              <p className="text-sm text-gray-600">Total Units: 21</p>
              <p className="text-sm text-gray-600">Total Hours: 31</p>
              <p className="text-sm text-gray-600">Total Amount: P8290.00</p>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              onClick={() => navigate("/registrar/billing")}
            >
              Back to Course
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleConfirmEnrollment}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatePayment;
