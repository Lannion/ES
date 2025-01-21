import React, { useState, useEffect } from "react";
import useData from "../../components/DataUtil";
import { useAlert } from "../../components/Alert";

const RegistrarRegisterForm = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [studentData, setStudentData] = useState({
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        section: "",
        address: {
            street: "",
            barangay: "",
            city: "",
            province: ""
        },
        date_of_birth: "", 
        gender: "",
        contact_number: "",
        year_level: "",
        semester: "",
        enrollment_status: "NOT_ENROLLED",
    });

    const { data, error, createData } = useData(`/api/student/`);
    const [trigger, setTrigger] = useState(false);
    const {triggerAlert} = useAlert();

    useEffect(() => {
        if (data) {
            setTrigger(true);
            triggerAlert("success", "Success", "Student added successfully");
        }
        if (error) {
            setTrigger(false);
        }
    }, [data, error, createData, trigger]);

    useEffect(() => {
        if (error) {
          // Check if the error contains a `data` object with missing fields
          if (error?.data) {
            const missingFields = Object.keys(error.data); // Extract keys from the error data
      
            // Convert keys to a user-friendly message
            const errorMessage = missingFields.length > 0
              ? `The following fields are missing or invalid: ${missingFields.join(", ")}`
              : "An error occurred";
      
            // Trigger alert with the generated error message
            triggerAlert("error", "Error", errorMessage);
          } else {
            // Default fallback for unknown errors
            triggerAlert("error", "Error", "An unexpected error occurred.");
          }
        }
      }, [error]);      

    const [showConfirmation, setShowConfirmation] = useState(false);

    const requiredPageOneFields = [
        studentData.id,
        studentData.year_level,
        studentData.semester,
        studentData.email
    ];

    const requiredPageTwoFields = [
        studentData.last_name,
        studentData.first_name,
        studentData.address.city,
        studentData.address.province,
        studentData.gender,
        studentData.contact_number,
        studentData.date_of_birth,
    ];

    const handleNext = () => {
        if (step === 1 && requiredPageOneFields.includes("")) {
            triggerAlert("error", "Error", "Please fill out all required fields.");
            return;
        }

        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in studentData.address) {
            setStudentData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));
        } else {
            setStudentData((prev) => ({
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

    const handleRegister = () => {
        setShowConfirmation(true);
    };

    const confirmRegister = async () => {
        if (step === 2 && requiredPageTwoFields.includes("")) {
            triggerAlert("error", "Error", "Please fill out all required fields.");
            return;
        } else {
            if (studentData) {
                const payload = studentData;
                const res = await createData(payload);
                if (res?.success) {
                    triggerAlert("success", "Success", "Student added successfully");
                } else {
                    triggerAlert("error", "Error", res?.data?.error || "An error occurred");
                }
                // triggerAlert("success", "Success", "Student added successfully");
            }
    
            if (onSave) {
                onSave(studentData); // Save the student data
            }
            console.log(error?.response);
            setShowConfirmation(false);
             // Move to the final step
        }

    };

    useEffect(() => {
        if(trigger) {
            handleNext();
        }

        if(error){
            triggerAlert("error", "Error", error?.message|| error?.detail || "An error occurred");
        }
        
    }, [trigger]);

    const cancelRegister = () => {
        setShowConfirmation(false);
    };

    const handleFinish = () => {
        if (onClose) {
            onClose(); // Close the modal
            // window.location.reload();
            setTrigger(true);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={handleCancel} // Close modal when clicking outside
        >
            <div
                className="bg-white rounded-2xl shadow-lg w-[52rem] py-[2rem] px-[3rem] h-[40rem] flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Register Student</h2>
                </div>

                {/* Step Indicator */}
                <div className="flex justify-center items-center mb-6">
                    {[1, 2, 3].map((stepIndex) => (
                        <div key={stepIndex} className="flex items-center">
                            <div
                                className={`w-[40px] h-[40px] flex items-center justify-center rounded-full text-sm font-semibold ${stepIndex <= step
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-gray-700"
                                    }`}
                            >
                                {stepIndex}
                            </div>
                            {stepIndex !== 3 && (
                                <div
                                    className={`h-[4px] ${stepIndex < step ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                    style={{ width: "100px" }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {step === 1 && (
                    <div className="flex-1 overflow-auto">
                        <h3 className="text-center text-lg font-medium text-gray-800 mb-4">
                            Student Information
                        </h3>
                        <form className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Student Number * <span className="text-red-500">{error?.data?.id}</span></label>
                                <input
                                    type="text"
                                    name="id"
                                    value={studentData.id}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.id ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Year Level * <span className="text-red-500">{error?.data?.year_level}</span></label>
                                <input
                                    type="text"
                                    name="year_level"
                                    value={studentData.year_level}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.year_level ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Semester * <span className="text-red-500">{error?.data?.semester}</span></label>
                                <select
                                    name="semester"
                                    value={studentData.semester}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.semester ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                >
                                    <option value="">Select Semester</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Section (Not Required)</label>
                                <input
                                    type="text"
                                    name="section"
                                    value={studentData.section}
                                    onChange={handleChange}
                                    className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email * <span className="text-red-500">{error?.data?.email}</span></label>
                                <input
                                    type="text"
                                    name="email"
                                    value={studentData.email}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.email ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex-1 overflow-auto">
                        <h3 className="text-center text-lg font-medium text-gray-800 mb-4">
                            Personal Data
                        </h3>
                        <form className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Name * <span className="text-red-500">{error?.data?.last_name}</span></label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={studentData.last_name}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.last_name ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Street * <span className="text-red-500">{error?.data?.street}</span></label>
                                <input
                                    type="text"
                                    name="street"
                                    value={studentData.address.street}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.street ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">First Name * <span className="text-red-500">{error?.data?.first_name}</span></label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={studentData.first_name}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.first_name ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Barangay * <span className="text-red-500">{error?.data?.barangay}</span></label>
                                <input
                                    type="text"
                                    name="barangay"
                                    value={studentData.address.barangay}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.barangay ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Middle Name (Optional)</label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    value={studentData.middle_name}
                                    onChange={handleChange}
                                    className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Suffix (Optional)</label>
                                <input
                                    type="text"
                                    name="suffix"
                                    value={studentData.suffix}
                                    onChange={handleChange}
                                    className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">City * <span className="text-red-500">{error?.data?.city}</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    value={studentData.address.city}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.city ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Gender * <span className="text-red-500">{error?.data?.gender}</span></label>
                                <select
                                    name="gender"
                                    value={studentData.gender}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.gender ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Province * <span className="text-red-500">{error?.data?.province}</span></label>
                                <input
                                    type="text"
                                    name="province"
                                    value={studentData.address.province}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.province ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Number * <span className="text-red-500">{error?.data?.contact_number}</span></label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={studentData.contact_number}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.contact_number ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date of Birth * <span className="text-red-500">{error?.data?.date_of_birth}</span></label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={studentData.date_of_birth}
                                    onChange={handleChange}
                                    className={`border rounded-lg w-full p-2 focus:ring-2 ${error?.data?.date_of_birth ? 'border-red-500' : 'focus:ring-blue-500'}`}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Student Registered!</h3>
                        <p className="text-gray-600 mb-6">
                            The student has been successfully registered.
                        </p>
                    </div>
                )}

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center">
                            <h3 className="text-lg font-bold mb-4">Confirm Registration</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Are you sure you want to register this student?
                            </p>
                            <div className="flex justify-around">
                                <button
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    onClick={cancelRegister}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    onClick={confirmRegister}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-500">
                        Note: Saving this changes your data in the database.
                    </p>
                    <div className="flex space-x-4">
                        {step === 1 && (
                            <button
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                        {step > 1 && (
                            <button
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        )}
                        {step < 2 ? (
                            <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : step === 2 ? (
                            <button
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        ) : (
                            <button
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                onClick={handleFinish}
                            >
                                Finish
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrarRegisterForm;