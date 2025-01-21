import React, { useState, useEffect } from "react";
import useData from "../../components/DataUtil";

const DepartmentAddCourse = ({ onClose, onSave }) => {
  const [courseDetails, setCourseDetails] = useState({
    course: "",
    year: "",
    section: "",
  });

  const [isSaved, setIsSaved] = useState(false); // New state to track if data was saved
  const [isSaving, setIsSaving] = useState(false); // Track saving state to prevent multiple saves

  const { data, error, createData } = useData("/api/course/");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Close the modal
    }
  };

  const handleSave = async () => {
    setIsSaving(true); // Start saving

    try {
      const response = await createData(courseDetails);
      
      if (onSave) {
        onSave(response); // Save the course data
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
      console.error("Error saving course:", error);
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
        className="bg-white rounded-2xl shadow-lg w-[30rem] p-8"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <h2 className="text-2xl font-bold mb-6 text-center">ADD COURSE</h2>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <select
              name="course"
              value={courseDetails.course}
              onChange={handleChange}
              className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Course
              </option>
              <option value="BSCS">BSCS</option>
              <option value="BSIT">BSIT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                name="year"
                value={courseDetails.year}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input
                type="text"
                name="section"
                placeholder="Input Here"
                value={courseDetails.section}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            onClick={handleCancel}
          >
            CANCEL
          </button>
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isSaving ? "bg-gray-500" : "bg-blue-600"}`}
            onClick={handleSave}
            disabled={isSaving} // Disable button while saving
          >
            {isSaving ? "Saving..." : "CONFIRM"}
          </button>
        </div>

        {/* Success Feedback */}
        {isSaved && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 rounded-t-2xl">
            Course added successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentAddCourse;
