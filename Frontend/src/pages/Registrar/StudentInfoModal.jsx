import React, { useState } from "react";

const StudentInfoModal = ({ student, onClose, onSave }) => {
  const [updatedStudent, setUpdatedStudent] = useState({ ...student });
  const [currentView, setCurrentView] = useState("studentInfo");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(updatedStudent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[52rem] py-[2rem] px-[3rem] h-[40rem] flex flex-col">
        {/* Modal Tabs */}
        <div className="flex justify-between text-lg font-semibold mb-4 border-b-2">
          <button
            onClick={() => setCurrentView("studentInfo")}
            className={`w-1/2 pb-2 ${
              currentView === "studentInfo"
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-500"
            }`}
          >
            STUDENT INFO
          </button>
          <button
            onClick={() => setCurrentView("personalData")}
            className={`w-1/2 pb-2 ${
              currentView === "personalData"
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-500"
            }`}
          >
            PERSONAL DATA
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {currentView === "studentInfo" && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Student Number *
                </label>
                <input
                  type="text"
                  name="studentNumber"
                  value={updatedStudent.studentNumber || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course *
                </label>
                <select
                  name="course"
                  value={updatedStudent.course || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Course</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSCS">BSCS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={updatedStudent.email || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Year Level *
                </label>
                <select
                  name="yearLevel"
                  value={updatedStudent.yearLevel || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Year Level</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Mid Fourth Year">Mid Fourth Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select
                  name="status"
                  value={updatedStudent.status || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={updatedStudent.semester || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Semester</option>
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={updatedStudent.contactNumber || ""}
                  onChange={handleChange}
                  placeholder="+639"
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section *
                </label>
                <select
                  name="section"
                  value={updatedStudent.section || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>
          )}

          {currentView === "personalData" && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={updatedStudent.lastName || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Street *</label>
                <input
                  type="text"
                  name="street"
                  value={updatedStudent.street || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={updatedStudent.firstName || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Barangay *
                </label>
                <input
                  type="text"
                  name="barangay"
                  value={updatedStudent.barangay || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Suffix (Optional)
                </label>
                <input
                  type="text"
                  name="suffix"
                  value={updatedStudent.suffix || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={updatedStudent.city || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  name="gender"
                  value={updatedStudent.gender || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Province *
                </label>
                <input
                  type="text"
                  name="province"
                  value={updatedStudent.province || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={updatedStudent.contactNumber || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={updatedStudent.dob || ""}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Note: Saving this changes your data in the database.
          </p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              onClick={onClose}
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
    </div>
  );
};

export default StudentInfoModal;
