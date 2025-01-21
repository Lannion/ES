import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import universityLogo from "../../images/universityLogo.svg";
import LogoutIcon from "../../images/LogoutIcon.svg";

const Header = ({ onLogout = () => {} }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for logout modal

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Open the logout confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const confirmLogout = () => {
    // console.log("Triggering onLogout function:", onLogout); // Debugging to ensure onLogout is passed
    setIsModalOpen(false); // Close the modal
    onLogout(); // Trigger the logout function passed as a prop
    navigate("/student"); // Redirect to the login page
  };

  return (
    <>
      <header className="bg-blue-900 text-white py-4 px-8 flex justify-between items-center">
        <div className="flex items-center">
          <img src={universityLogo} alt="University Logo" className="h-10" />
          <h1 className="text-lg font-bold ml-4 uppercase">
            Cavite State University - Bacoor
          </h1>
        </div>
        <button
          className="flex items-center text-white hover:text-gray-300"
          onClick={handleLogoutClick}
        >
          <img src={LogoutIcon} alt="Logout Icon" className="h-5 mr-2" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </header>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[20rem]">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
