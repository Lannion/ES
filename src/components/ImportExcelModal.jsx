import React, { useState } from "react";
import useData from "./DataUtil";
import { useAlert } from "./Alert";

const ImportExcelModal = ({ isOpen, onClose, excelType }) => {
  const [file, setFile] = useState(null);
  const { createData } = useData("/api/excel/import/"); // useData for API requests
  const { triggerAlert } = useAlert(); // useAlert for notifications

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      triggerAlert("error", "No File Selected", "Please select a file to import.");
      return;
    }
  
    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", excelType); // Type is 'students' or 'grades'
  
    try {
      // Use the createData function to send the form data to the API
      const response = await createData(formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type for file upload
        },
      });
  
      if (response) {
        triggerAlert("success", "Import Successful", "Excel file imported successfully!");
        setFile(null); // Clear file input after success
        onClose(); // Close the modal
      }
    } catch (err) {
      triggerAlert(
        "error",
        "Import Failed",
        err?.message || "Failed to import the file. Please try again."
      );
    }
  };  

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-96 p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Import Excel File</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ImportExcelModal;
