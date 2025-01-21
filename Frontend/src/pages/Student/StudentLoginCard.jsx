import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import universityLogo from "../../images/universityLogo.svg";
import loginIcon from "../../images/loginIcon.svg";
import { useNavigate } from "react-router-dom";
import { validateCredentials } from "../../StaticFunctions/staticFunctions";

const StudentLoginCard = ({ onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsDesktop(true);
        setShowForm(false);
      } else {
        setIsDesktop(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleLoginClick = async () => {
    setErrorMessage(""); // Clear any previous errors
    const group = "student";
  
    try {
      const response = await onLogin(studentNumber, password, group); // Wait for the promise to resolve
      console.log(response);
  
      if (response.success) {
        console.log("Login Successfully");
        navigate(`/${group}/dashboard`);
      } else {
        setErrorMessage(response.detail || response.error || "Login failed.");
        if(response.group){
          navigate(`/${response.group}/`);
        }
      }
      
    } catch (error) {
      setErrorMessage(error.error); // Handle unexpected errors
    }
  };
  

  const handleRegisterClick = () => {
    navigate("/student/register");
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
}, [studentNumber, password]);

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-r from-yellow-400 to-blue-900 overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-center justify-center rounded-[32px] shadow-lg overflow-hidden w-full max-w-[1027px] h-auto lg:h-[641px] mx-4 lg:mx-0">
        
        {/* Left Section */}
        {!showForm && (
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
            {!isDesktop && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-8 w-[180px] py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
              >
                Login
              </button>
            )}
          </div>
        )}

        {/* Right Section */}
        {(showForm || isDesktop) && (
          <div className="flex flex-col justify-center items-center w-full lg:w-[600px] h-[500px] lg:h-[641px] bg-white bg-opacity-25 p-6 lg:ml-[436px]">
            <div className="bg-blue-900 p-4 rounded-full shadow-lg mb-6">
              <img src={loginIcon} alt="Login Icon" className="h-[80px] lg:h-[120px] w-[80px] lg:w-[120px]" />
            </div>

            <h2 className="text-[24px] lg:text-[30px] font-extrabold text-black mb-6 font-inter">
              STUDENT LOGIN
            </h2>

            <div className="w-full max-w-[350px]">
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="STUDENT NUMBER"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
              />
              <div className="relative mb-6">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
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
            </div>

            <div className="flex flex-col items-center text-sm mb-6">
              <button className="text-blue-600 hover:underline mb-2" onClick={() => handleForgotPassword()}>
                Forgot Password?
              </button>
              <p>
                Don’t have an account?{" "}
                <button onClick={handleRegisterClick} className="text-blue-600 font-semibold hover:underline">
                  Register
                </button>
              </p>
            </div>

            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

            <button onClick={handleLoginClick} onKeyDown={handleKeyDown} className="w-[180px] py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 shadow-md">
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLoginCard;
