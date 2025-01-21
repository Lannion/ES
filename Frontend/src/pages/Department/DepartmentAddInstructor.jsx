import React, { useState, useEffect } from "react";
import useData from "../../components/DataUtil";

const DepartmentAddInstructor = ({ onClose, onSave }) => {
  const [instructorData, setInstructorData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix: "",
    gender: "",
    email: "",
    contact_number: "",
    address: {
      street: "",
      barangay: "",
      city: "",
      province: ""
    }
  });

  const [isSaved, setIsSaved] = useState(false); // New state to track if data was saved
  const [isSaving, setIsSaving] = useState(false); // Track saving state to prevent multiple saves

  const { data, error, createData } = useData("/api/instructor/");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in instructorData.address) {
      setInstructorData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setInstructorData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Close the modal
    }
  };

  const handleSave = async () => {
    setIsSaving(true); // Start saving

    try {
      const response = await createData(instructorData);
      
      if (onSave) {
        onSave(response); // Save the instructor data
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
      console.error("Error saving instructor:", error);
      setIsSaving(false); // Stop saving
    }
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
        className="bg-white rounded-2xl shadow-lg lg:w-[52rem] md:w-[43rem] sm:w-[34rem] lg:h-[40rem] md:h-[38rem] sm:h-[36rem] py-[2rem] px-[3rem]   flex flex-col max-w-full  "
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Add Instructor
          </h2>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto">
          <form className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={instructorData.last_name}
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
                name="first_name"
                value={instructorData.first_name}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Middle Name *
              </label>
              <input
                type="text"
                name="middle_name"
                value={instructorData.middle_name}
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
                value={instructorData.suffix}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender *</label>
              <select
                name="gender"
                value={instructorData.gender}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                {/* <option value="Non-binary">Non-binary</option> */}
                <option value="PREFER NOT TO SAY">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={instructorData.email}
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
                name="contact_number"
                value={instructorData.contact_number}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Street *</label>
              <input
                type="text"
                name="street"
                value={instructorData.address.street}
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
                value={instructorData.address.barangay}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={instructorData.address.city}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Province *
              </label>
              <input
                type="text"
                name="province"
                value={instructorData.address.province}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Note: Ensure the details are accurate before saving.
          </p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2 ${
                isSaving ? "bg-gray-500" : "bg-green-600"
              } text-white rounded-lg hover:bg-green-700`}
              onClick={handleSave}
              disabled={isSaving} // Disable button while saving
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Success Feedback */}
        {isSaved && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 rounded-t-2xl">
            Instructor added successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentAddInstructor;