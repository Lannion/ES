import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useData from "./DataUtil";
import { useAlert } from "./Alert";

const InformationModal = ({ url, data, onClose, onSave, onEnroll, neededAdvising=false, isEditable = true }) => {
  const [updatedData, setUpdatedData] = useState({ ...data });
  const {triggerAlert} = useAlert();
  const navigate = useNavigate();

  const { updateData } = useData(url);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(updatedData); // Pass updated data to the parent component
      try{
        await updateData(data?.id, updatedData);
        triggerAlert("success", "Sucess", "Saved");
      } catch(err){
        triggerAlert("error", "Error", err || "Error saving data.");
      }
    }
    onClose(); // Close modal
  };

  const handleEnroll = () =>{
    if(onEnroll){
      navigate(`/department/evaluate-student/${data.id}`, { state: { student: data } });
    }
  }

  useEffect(()=>{
    console.log(neededAdvising);
  }, []);

  const renderFormFields = () => {
    return Object.keys(updatedData).map((key) => {
      if (typeof updatedData[key] === 'object' && updatedData[key] !== null) {
        return Object.keys(updatedData[key]).map((subKey) => (
          <div key={`${key}.${subKey}`}>
            <label className="block text-sm font-medium mb-1">{subKey.replace(/_/g, ' ')} *</label>
            <input
              type="text"
              name={`${key}.${subKey}`}
              value={updatedData[key][subKey] || ""}
              onChange={(e) => handleChange({ target: { name: key, value: { ...updatedData[key], [subKey]: e.target.value } } })}
              disabled={!isEditable}  // Disable input if not editable
              className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ));
      } else {
        const selectOptions = {
          gender: ["MALE", "FEMALE", "PREFER NOT TO SAY"],
          enrollment_status: ["ENROLLED", "WAITLISTED", "NOT_ENROLLED", "PENDING_REQUEST"],
          program: ["BSCS", "BSIT"],
          status: ["REGULAR", "IRREGULAR", "TRANSFEREE"],
          category: ["OLD", "NEW"],
          year_level: ["1", "2", "3", "4"],
          semester: ["1", "2"],
        };

        const isDateField = key.toLowerCase().includes("date");

        return (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{key.replace(/_/g, ' ')} *</label>
            {selectOptions[key] ? (
              <select
                name={key}
                value={updatedData[key] || ""}
                onChange={handleChange}
                disabled={!isEditable}  // Disable select if not editable
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select {key.replace(/_/g, ' ')}</option>
                {selectOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : isDateField ? (
              <input
                type="date"
                name={key}
                value={updatedData[key] || ""}
                onChange={handleChange}
                disabled={!isEditable}  // Disable input if not editable
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type="text"
                name={key}
                value={updatedData[key] || ""}
                onChange={handleChange}
                disabled={!isEditable}  // Disable input if not editable
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl shadow-lg w-[52rem] py-[2rem] px-[3rem] h-[40rem] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Edit Information</h2>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto">
          <form className="grid grid-cols-2 gap-x-8 gap-y-6">
            {renderFormFields()}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">Note: Ensure the details are accurate before saving.</p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              {isEditable ? `Cancel`:`Back`}
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleSave}
              disabled={!isEditable}  // Disable save button if not editable
              hidden={!isEditable}
            >
              Save
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={handleEnroll}
              disabled={!isEditable}  // Disable save button if not editable
              hidden={!isEditable || !neededAdvising}
            >
              Verify Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;
