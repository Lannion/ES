import React, { useState, useEffect } from "react";
import useData from "../../components/DataUtil";

const DepartmentAddStudent = ({ onClose, onSave }) => {
  const [studentData, setStudentData] = useState({
    studentNumber: "",
    email: "",
    status: "",
    contactNumber: "",
    course: "",
    yearLevel: "",
    section: "",
    lastName: "",
    street: "",
    middleName: "",
    suffix: "",
    gender: "",
    firstName: "",
    barangay: "",
    city: "",
    province: "",
    dateOfBirth: "",
    contactNo: "",
  });

  const [isSaved, setIsSaved] = useState(false); // New state to track if data was saved
  const [isSaving, setIsSaving] = useState(false); // Track saving state to prevent multiple saves
  const [activeTab, setActiveTab] = useState("studentInfo"); // State to track active tab

  const { data, error, createData } = useData("/api/student/");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Close the modal
    }
  };

  const handleSave = async () => {
    setIsSaving(true); // Start saving

    try {
      const response = await createData(studentData);
      
      if (onSave) {
        onSave(response); // Save the student data
      }
      setIsSaving(false); // Stop saving

      // Set saved state and show feedback message
      setIsSaved(true);

      // Close modal after 2 seconds (optional, you can change this)
      setTimeout(() => {
        setIsSaved(false); // Reset saved state
        if (onClose) {
          onClose(); // Close the modal
        }
      }, 2000); // Modal closes after 2 seconds
    } catch (error) {
      console.error("Error saving student:", error);
      setIsSaving(false); // Stop saving
    }
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
      if (data) {
        console.log(data);
      } else if (error) {
        console.log(error.response);
      }
    }, [data, error, createData]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={handleCancel} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-[50rem] py-8 px-10"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex justify-between mb-6">
          {/* Toggleable Headers */}
          <h2
            className={`text-xl font-semibold border-b-2 pb-1 cursor-pointer ${
              activeTab === "studentInfo"
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => toggleTab("studentInfo")}
          >
            STUDENT INFO
          </h2>
          <h2
            className={`text-xl font-semibold border-b-2 pb-1 cursor-pointer ${
              activeTab === "personalData"
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => toggleTab("personalData")}
          >
            PERSONAL DATA
          </h2>
        </div>

        {/* Conditional Rendering of Content Based on Active Tab */}
        {activeTab === "studentInfo" && (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Student Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentNumber"
                  value={studentData.studentNumber || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={studentData.email || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={studentData.status || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={studentData.contactNumber || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={studentData.course || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Year Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="yearLevel"
                  value={studentData.yearLevel || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="section"
                  value={studentData.section || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "personalData" && (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={studentData.lastName || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Street <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={studentData.street || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Middle Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={studentData.middleName || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={studentData.suffix || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={studentData.gender || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={studentData.firstName || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Barangay <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="barangay"
                  value={studentData.barangay || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={studentData.city || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="province"
                  value={studentData.province || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={studentData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Contact No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactNo"
                  value={studentData.contactNo || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6">
          Note: Saving this changes your data in the database.
        </p>

        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-4"
            onClick={handleCancel}
          >
            Back
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={handleSave}
            disabled={isSaving} // Disable button while saving
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Feedback message */}
        {isSaved && (
          <div className="mt-4 text-green-500 text-center">
            Student data saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentAddStudent;
