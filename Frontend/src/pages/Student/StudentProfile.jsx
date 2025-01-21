import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";
import { useAlert } from "../../components/Alert";

const StudentProfile = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState("account");
  const [currentSection, setCurrentSection] = useState("profile"); // Track current section
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch student and user data
  const { data: studentData, error: studentError, getData: getStudentData } = useData("/api/student/");
  const { data: userData, error: userError, getData: getUserData, updateData: updateUserData } = useData("/api/user/");
  const [student, setStudent] = useState(null);
  const [user, setUser] = useState(null);
  const {triggerAlert} = useAlert();

  useEffect(() => {
    // Fetch student and user data on component mount
    const fetchData = async () => {
      await getStudentData();
      await getUserData();
    };
    fetchData();
  }, [getStudentData, getUserData]);

  useEffect(() => {
    // Update student and user states when data is fetched
    if (studentData) setStudent(studentData[0]); // Access the first item in the array
  }, [studentData]);

  useEffect(()=>{
    if (userData) {
      setUser(userData[0]); // Access the first item in the 
      if(userData?.success) {
        console.log(userData?.detail);
        setCurrentView("account");
      }
    } else if (userError) {
      console.log(userError?.error);
    }
  }, [userData])

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerAlert("error", "Empty Fields", "Please fill out all password fields.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      triggerAlert("error", "Password Mismatch", "Passwords do not match.");
      return;
    }
  
    const passwordPayload = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    try {
      const res = await updateUserData(user?.id, passwordPayload);
      if (res?.success) {
        triggerAlert("success", "Password Updated", "Password has been updated successfully.");
        setCurrentView("account");
      } else {
        triggerAlert("error", "Password Update Failed", res?.error || "Failed to update password.");
      }
    } catch (error) {
      triggerAlert("error", "Password Update Failed", error?.error || "Failed to update password.");
    }
  };
  
  

  const handleNavigate = (section) => {
    setCurrentSection(section); // Update current section
    switch (section) {
      case "dashboard":
        navigate("/student/dashboard");
        break;
      case "profile":
        navigate("/student/profile");
        break;
      case "cor":
        navigate("/student/cor");
        break;
      case "checklist":
        navigate("/student/checklist");
        break;
      default:
        break;
    }
  };

    return (
      <div className="w-screen min-h-screen lg:h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0] flex flex-col lg:flex-row overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar onNavigate={handleNavigate} activeSection={currentSection} />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header onLogout={onLogout} />

          {/* Main Content */}
          <div className="flex justify-center items-center h-full px-4 sm:px-6 md:px-8 lg:px-0 lg:h-[calc(100%-4rem)] mt-7 mb-[7rem]">
            <div className="relative bg-white rounded-[1.5rem] shadow-lg p-6 md:p-10 w-full max-w-[30rem] lg:max-w-[60rem] min-h-[24rem] flex flex-col">
              {/* Tabs */}
              <div className="flex justify-between items-center text-lg font-bold mb-6 border-b-[0.125rem] border-gray-200">
                <button
                  onClick={() => setCurrentView("account")}
                  className={`w-1/2 text-center pb-2 transition ${
                    currentView === "account"
                      ? "text-blue-500 border-b-[0.125rem] border-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setCurrentView("personalData")}
                  className={`w-1/2 text-center pb-2 transition ${
                    currentView === "personalData"
                      ? "text-blue-500 border-b-[0.125rem] border-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  Personal Data
                </button>
              </div>

              {/* Views */}
              <div className="flex-1 overflow-auto">
                {/* Account View */}
                {currentView === "account" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[0.9rem]">
                      <div>
                        <p className="text-gray-800 font-semibold">
                          Student Number:
                        </p>
                        <p className="text-gray-600">{student?.id || "No student id."}</p>
                        <p className="text-gray-800 font-semibold mt-4">Email:</p>
                        <p className="text-gray-600">{student?.email || "No assigned email."}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Status:
                        </p>
                        <p className="text-gray-600">{student?.status || "Not enrolled."}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Contact Number:
                        </p>
                        <p className="text-gray-600">{student?.contact_number || "No assigned contact number."}</p>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">Course:</p>
                        <p className="text-gray-600">{student?.program || "No program yet."}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Year Level:
                        </p>
                        <p className="text-gray-600">{student?.year_level || "Not enrolled yet."}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Section:
                        </p>
                        <p className="text-gray-600">{student?.section || "To be announced."}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Password:
                        </p>
                        <p className="text-gray-600">{"Password is secured"}</p>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setCurrentView("changePassword")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}

                {/* Change Password View */}
                {currentView === "changePassword" && (
                  <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                    <div className="w-full max-w-[25rem] space-y-6">
                      <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold">
                          Old Password:
                        </label>
                        <input
                          type="password"
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold">
                          New Password:
                        </label>
                        <input
                          type="password"
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold">
                          Confirm Password:
                        </label>
                        <input
                          type="password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setCurrentView("account")}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSavePassword}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Personal Data View */}
                {currentView === "personalData" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[0.9rem]">
                      <div>
                        <p className="text-gray-800 font-semibold">Last Name:</p>
                        <p className="text-gray-600">{student?.last_name}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Middle Name:
                        </p>
                        <p className="text-gray-600">{student?.middle_name}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Address:
                        </p>
                        <p className="text-gray-600">{`${student?.address?.street || ""} ${student?.address?.barangay || ""} ${student?.address?.city}, ${student?.address?.province} `}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Gender:
                        </p>
                        <p className="text-gray-600">{student?.gender}</p>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">First Name:</p>
                        <p className="text-gray-600">{student?.first_name}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Suffix:
                        </p>
                        <p className="text-gray-600">{student?.suffix || "No Suffix"}</p>
                        <p className="text-gray-800 font-semibold mt-4">
                          Birthday:
                        </p>
                        <p className="text-gray-600">{student?.date_of_birth}</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setCurrentView("account")}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default StudentProfile;