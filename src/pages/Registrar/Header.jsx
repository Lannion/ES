import React from "react";
import universityLogo from "../../images/universityLogo.svg";
import LogoutIcon from "../../images/LogoutIcon.svg";

const Header = () => {
  return (
    <header className="bg-blue-900 text-white py-4 px-8 flex justify-between items-center">
      {/* University Logo and Title */}
      <div className="flex items-center">
        <img src={universityLogo} alt="University Logo" className="h-10" />
        <h1 className="text-lg font-bold ml-4 uppercase">
          Cavite State University - Bacoor
        </h1>
      </div>

      {/* Logout Button */}
      <button className="flex items-center text-white hover:text-gray-300">
        <img src={LogoutIcon} alt="Logout Icon" className="h-5 mr-2" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </header>
  );
};

export default Header;
