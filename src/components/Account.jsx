import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useData from "./DataUtil";
import { useAlert } from "./Alert";

const Account = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState("account");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { data, error, getData } = useData("/api/user/");
  const { updateData } = useData("/api/user/");
  const [user, setUser] = useState({});
  const [fetchedError, setFectchedError] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const {triggerAlert} = useAlert();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    // Fetch student and user data on component mount
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [getData, triggerAlert]);

  useEffect(() => {
    if (data) {
      const fetchedUser = data[0]; // Access the first item in the array
      setUser(fetchedUser); // Update the user state
  
      // Ensure formData is updated only after the user state is set
      setFormData((prevFormData) => ({
        ...prevFormData,
        first_name: fetchedUser?.first_name || "",
        last_name: fetchedUser?.last_name || "",
        email: fetchedUser?.email || "",
      }));
    }
  
    if (error) {
      console.error("Error saving data:", error);
      const errorMap = {};
      if (error?.errors) {
        error?.errors?.forEach((err) => {
          if (Array.isArray(err.fields)) {
            err.fields.forEach((field) => {
              errorMap[field] = err.detail;
            });
          } else {
            errorMap[err.fields] = err.detail;
          }
        });
      }
      setFectchedError(errorMap);
    }
  }, [data, error]);  

  const handleSave = async () => {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    };
  
    if (formData.oldPassword && formData.newPassword && formData.confirmPassword) {
      payload.old_password = formData.oldPassword;
      payload.new_password = formData.newPassword;
      payload.confirm_password = formData.confirmPassword;
    }
  
    try {
      await updateData(user?.id, payload);
      setIsEditing(false);
      triggerAlert("success", "Success", "Data saved successfully!");
      setTrigger(true);
      // window.location.reload();
    } catch (error) {
      triggerAlert("error", "Error", "Failed to save data.");
    }
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  return (
    <div
        className="flex justify-center items-center min-h-screen w-full px-4 md:px-8 lg:px-16 transition-all duration-300"
    >
        <div className="bg-white shadow-lg rounded-[1.875rem] p-6 md:p-8 max-w-[50rem] w-full">
            <h1 className="text-[1.5rem] md:text-[1.875rem] font-semibold text-gray-800 mb-4 text-center">
                User Account
            </h1>
            <hr className="border-t-[0.125rem] border-blue-500 mb-6 mx-auto w-[90%]" />

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                    <p className="text-[1rem] font-bold text-gray-700">Name:</p>
                    <p className="text-[1rem] text-gray-700">
                        {user?.last_name && user?.first_name
                            ? `${user?.last_name}, ${user?.first_name}`
                            : "No Name"}
                    </p>
                </div>
                <div>
                    <p className="text-[1rem] font-bold text-gray-700">Username:</p>
                    <p className="text-[1rem] text-gray-700">{user?.username || "No Username"}</p>
                </div>
                <div>
                    <p className="text-[1rem] font-bold text-gray-700">Password:</p>
                    <p className="text-[1rem] text-gray-700">Password is secured</p>
                </div>
                <div>
                    <p className="text-[1rem] font-bold text-gray-700">Date Joined:</p>
                    <p className="text-[1rem] text-gray-700">
                        {new Date(user?.date_joined).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <p className="text-[0.875rem] text-gray-500 mt-6 text-center">
                Note: You can edit your account's password and personal data only.
            </p>
            <div className="flex justify-center mt-6">
                <button
                    className="bg-blue-600 text-white px-[1rem] py-[0.75rem] rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    onClick={() => setIsEditing(true)}
                >
                    Edit
                </button>
            </div>
        </div>

      
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[40rem] py-8 px-8">
            {/* Modal Tabs */}
            <div className="flex justify-between text-lg font-semibold mb-6 border-b-2">
              <button
                onClick={() => setCurrentTab("account")}
                className={`w-1/2 pb-2 text-center ${
                  currentTab === "account"
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Account
              </button>
              <button
                onClick={() => setCurrentTab("personalData")}
                className={`w-1/2 pb-2 text-center ${
                  currentTab === "personalData"
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Personal Data
              </button>
            </div>

            {/* Modal Content */}
            <div>
              {currentTab === "account" && (
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium">Old Password *<span className="text-red-500">{fetchedError?.old_password || ""}</span></label>
                    <input
                      type="password"
                      name="oldPassword"
                      className={`border rounded-lg w-full p-2 focus:ring-2 ${fetchedError?.old_password ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={formData.oldPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">New Password *<span className="text-red-500">{fetchedError?.new_password || ""}</span></label>
                    <input
                      type="password"
                      name="newPassword"
                      className={`border rounded-lg w-full p-2 focus:ring-2 ${fetchedError?.new_password ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Confirm Password *<span className="text-red-500">{fetchedError?.confirm_password || ""}</span></label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className={`border rounded-lg w-full p-2 focus:ring-2 ${fetchedError?.confirm_password ? 'border-red-500' : 'focus:ring-blue-500'}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Note: Saving this changes your data in the database.
                  </p>
                </div>
              )}

              {currentTab === "personalData" && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium">First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="last_name"
                      className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="text"
                      name="email"
                      className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500 col-span-2">
                    Note: Saving this changes your data in the database.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Back
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
);
};

export default Account;