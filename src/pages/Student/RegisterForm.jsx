import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import universityLogo from "../../images/universityLogo.svg";
import registerIcon from "../../images/registerIcon.svg";
import useData from "../../components/DataUtil";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    re_password: "",
    group: "student"
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();
  const { data, error, createData } = useData("/api/register/");

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleRegisterClick = async () => {
    console.log(formData.password);
    console.log(formData.re_password);
    console.log(formData.password == formData.re_password);
    if(!formData.password || !formData.password || !formData.re_password){
      return setErrorMessage('Fill out student number and password fields.');
    }

    if(formData.password === formData.re_password){
      await createData(formData);
    } else {
      return setErrorMessage('Password do not match.');
    }
    // if (registrationResult === true) {
    //   setIsModalOpen(true); // Open modal on successful registration
    // } else {
    //   setErrorMessage(registrationResult);
    // }
  };

  useEffect(() => {
    // Update user state when data is fetched
    if (data?.success) setIsModalOpen(true);
    
    if (error) {
      setErrorMessage(
        error?.data?.non_field_errors ||
        error?.data?.message ||
        "An error occurred."
      );
    }
  }, [data, error]);  

  const handleBackToLogin = () => {
    navigate("/student");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/student"); // Redirect to login after closing modal
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRegisterClick();
    }
  };

useEffect(() => {
  // Add event listener for keydown
  window.addEventListener("keydown", handleKeyDown);

  // Cleanup the event listener on unmount
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [formData]);

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-r from-yellow-400 to-blue-900 overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-center justify-center rounded-[32px] shadow-lg overflow-hidden w-full max-w-[1027px] h-auto lg:h-[641px] mx-4 lg:mx-0">
        {/* Register Form Section */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[600px] h-[500px] lg:h-[641px] bg-white bg-opacity-25 p-6 lg:mr-[436px]">
          <button
            onClick={handleBackToLogin}
            className="absolute top-4 left-4 text-white text-2xl lg:text-3xl flex items-center hover:text-gray-300"
          >
            <FaArrowLeft className="mr-2" />
          </button>

          <div className="bg-blue-900 p-4 rounded-full shadow-lg mb-6">
            <img
              src={registerIcon}
              alt="Register Icon"
              className="h-[80px] lg:h-[120px] w-[80px] lg:w-[120px]"
            />
          </div>

          <h2 className="text-[24px] lg:text-[30px] font-extrabold text-black mb-6 font-inter">
            STUDENT REGISTER
          </h2>

          <div className="w-full max-w-[350px]">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="STUDENT NUMBER"
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
            />
            <div className="relative mb-4">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="PASSWORD"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {passwordVisible ? (
                  <FaEye className="w-5 h-5 text-gray-500" />
                ) : (
                  <FaEyeSlash className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            <div className="relative mb-6">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="re_password"
                value={formData.re_password}
                onChange={handleInputChange}
                placeholder="RETYPE PASSWORD"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[16px]"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {confirmPasswordVisible ? (
                  <FaEye className="w-5 h-5 text-gray-500" />
                ) : (
                  <FaEyeSlash className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            onClick={handleRegisterClick}
            onKeyDown={handleKeyDown}
            className="w-[180px] py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
          >
            Register
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-700 mb-6">
                You have successfully registered. Please log in to continue.
              </p>
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {/* Right Section for Desktop View Only */}
        {isDesktop && (
          <div className="flex flex-col justify-center items-center absolute right-0 z-10 w-[459px] h-[641px] bg-white rounded-[32px]">
            <img
              src={universityLogo}
              alt="University Logo"
              className="h-[220px] mb-6"
            />
            <h1 className="text-center text-[25px] font-extrabold text-gray-800">
              CAVITE STATE UNIVERSITY
            </h1>
            <h2 className="text-center text-[16px] font-medium text-gray-600 mt-2">
              BACOOR CAMPUS
            </h2>
            <h2 className="text-center text-[16px] font-bold text-gray-600 mt-[10rem] font-inter">
              Academic Records Viewer
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
