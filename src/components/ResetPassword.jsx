import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import universityLogo from "../images/universityLogo.svg";
import loginIcon from "../images/loginIcon.svg";
import { useNavigate, useParams } from "react-router-dom";
import useData from "./DataUtil";
import Loader from "./Loader";

const ResetPassword = () => {
  const { userId, token } = useParams(); // Extract userId and token from URL params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { createData, data, error } = useData(`/api/reset-password/${userId}/${token}/`);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  useEffect(()=>{
    if(!userId && !token) navigate('/student');
  }, []);

  const handlePasswordReset = async () => {
    // if(!newPassword || !confirmPassword){
    //   return setErrorMessage("All password fields must not be blank or empty");
    // }

    if (newPassword !== confirmPassword) {
      return setErrorMessage("Passwords do not match.");
    }

    const resetData = { new_password: newPassword };
    try {
      setIsLoading(true);
      const res = await createData(resetData); // This will call the updateData method and pass userId and token in URL
      if(res.success){
        setIsLoading(false);
      }
      // setSuccessMessage("Password reset successful.");
      setErrorMessage(""); // Clear error message if successful
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error?.response?.data?.error || "Error resetting password.");
    }
  };

  useEffect(() => {
    if (data) {
      if (data.groups && data.groups.length > 0) {
        const firstGroup = data.groups[0]; // Get the first group (e.g., "student")
        navigate(`/${firstGroup}`); // Redirect based on group name
      }
    }
    if (error) {
      console.error(error);
      setErrorMessage(error?.data?.error || "An error occurred.");
    }
  }, [data, error, navigate]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePasswordReset();
    }
  };

useEffect(() => {
  // Add event listener for keydown
  window.addEventListener("keydown", handleKeyDown);

  // Cleanup the event listener on unmount
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [newPassword, confirmPassword]);
  

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-r from-yellow-400 to-blue-900 overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-center justify-center rounded-[32px] shadow-lg overflow-hidden w-full max-w-[1027px] h-auto lg:h-[641px] mx-4 lg:mx-0">
        
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[459px] h-[500px] lg:h-[641px] bg-white p-6 rounded-[32px] lg:rounded-l-[32px] lg:absolute lg:top-0 lg:left-0 lg:z-10">
          <img src={universityLogo} alt="University Logo" className="h-[150px] lg:h-[220px] mb-6" />
          <h1 className="text-center text-[20px] lg:text-[25px] font-extrabold text-gray-800 font-inter">
            CAVITE STATE UNIVERSITY
          </h1>
          <h2 className="text-center text-[14px] lg:text-[16px] font-medium text-gray-600 mt-2 font-inter">
            BACOOR CAMPUS
          </h2>
          <h2 className="text-center text-[14px] lg:text-[16px] font-bold text-gray-600 mt-8 font-inter">
            Academic Records Viewer
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[600px] h-[500px] lg:h-[641px] bg-white bg-opacity-25 p-6 lg:ml-[436px]">
          <div className="bg-blue-900 p-4 rounded-full shadow-lg mb-6">
            <img src={loginIcon} alt="Login Icon" className="h-[80px] lg:h-[120px] w-[80px] lg:w-[120px]" />
          </div>

          <h2 className="text-[24px] lg:text-[30px] font-extrabold text-black mb-6 font-inter">
            RESET PASSWORD
          </h2>

          <div className="w-full max-w-[350px]">
            <div className="relative mb-6">
              <input
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {passwordVisible ? <FaEye className="w-5 h-5 text-gray-500" /> : <FaEyeSlash className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <div className="relative mb-6">
              <input
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
              />
            </div>
          </div>
          {isLoading && <Loader />}
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

          <button
            onClick={handlePasswordReset}
            onKeyDown={handleKeyDown}
            className="w-[180px] py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
