import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import universityLogo from "../../images/universityLogo.svg"; // Corrected path
import loginIcon from "../../images/Department/LoginIcons/OfficerIcon.svg"; // Corrected path
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { useAlert } from "../../components/Alert";

const DepartmentLoginCard = ({ onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {triggerAlert} = useAlert()

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleLoginClick = async () => {
    setErrorMessage(""); // Clear any previous errors
    const group = "department";

    try {
      const response = await onLogin(username, password, group); // Wait for the promise to resolve
      if (response.success) {
        navigate(`/${group}/dashboard`);
      } else {
        setErrorMessage(response.detail || response.error || "Login failed.");
        if (response.group) {
          navigate(`/${response.group}/`);
          triggerAlert("error", "User Authorization Error", `User is not department user but a ${response.group} user`);
        }
      }
    } catch (error) {
      setErrorMessage(error.error); // Handle unexpected errors
    }
  };

  const handleForgotPassword = () => {
    navigate('/forget-password/');
  }

  const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleLoginClick();
      }
    };
  
  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [username, password]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-yellow-400 to-blue-900 p-4">
      <div className="relative flex flex-col md:flex-row rounded-[32px] shadow-lg overflow-hidden w-full max-w-[1027px] h-auto md:h-[641px]">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center w-full md:w-[459px] bg-white rounded-t-[32px] md:rounded-l-[32px] md:rounded-r-none">
          <img
            src={universityLogo}
            alt="University Logo"
            className="h-[120px] md:h-[220px] mb-4 md:mb-6 mt-8 md:mt-0"
          />
          <h1 className="text-center text-[20px] md:text-[25px] font-extrabold text-gray-800">
            CAVITE STATE UNIVERSITY
          </h1>
          <h2 className="text-center text-[14px] md:text-[16px] font-medium text-gray-600 mt-2">
            BACOOR CAMPUS
          </h2>
          <h2 className="text-center text-[14px] md:text-[16px] font-bold text-gray-600 font-inter mt-0 md:mt-[10rem] mb-6 md:mb-0">
            Enrollment Management System
          </h2>

          {/* Mobile View Login Button with additional space */}
          <button
            onClick={handleLoginClick}
            className="w-full max-w-[180px] py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 mt-6 mb-8 md:hidden"
          >
            Login
          </button>
        </div>

        {/* Right Section (Hidden on Tablet and Smaller Screens) */}
        <div className="flex flex-col justify-center items-center w-full md:w-[600px] bg-white bg-opacity-25 p-6 hidden md:flex">
          <div className="bg-blue-900 p-4 rounded-full shadow-lg mb-4 md:mb-6">
            <img
              src={loginIcon}
              alt="Login Icon"
              className="h-[80px] w-[80px] md:h-[120px] md:w-[120px]"
            />
          </div>

          <h2 className="text-[24px] md:text-[30px] font-extrabold text-black mb-4 md:mb-6">
            DEPARTMENT LOGIN
          </h2>

          <div className="w-full max-w-[400px]">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage(""); // Clear error on input
              }}
              placeholder="USERNAME"
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md"
            />
            <div className="relative mb-4">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(""); // Clear error on input
                }}
                placeholder="PASSWORD"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {passwordVisible ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          <div className="flex flex-col items-center text-sm mb-6">
            <button className="text-blue-600 hover:underline mb-2" onClick={() => handleForgotPassword()}>
              Forgot Password?
            </button>
          </div>
          <button
            onClick={handleLoginClick}
            onKeyDown={handleKeyDown}
            className="w-full max-w-[180px] py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 mb-8"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLoginCard;
