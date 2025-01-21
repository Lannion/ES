import React, { useState, useEffect } from "react";
import useData from "./DataUtil";
import { useAlert } from "./Alert";

const EnrollmentDate = ({
  from_date = null, 
  to_date = null, 
  message = null, 
  program_names = [], 
  show_button = false, 
  student_id = "",
  student_status = "NOT_ENROLLED"
}) => {
  const { data, error, getData } = useData(`/api/enrollment_date/`);
  const { updateData } = useData(`/api/student/`);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const { triggerAlert } = useAlert();
  const [studentExist, setStudentExist] = useState(true);

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [getData]);

  useEffect(() => {
    // Update state when data changes
    if (data) {
      if (data?.enrollment_date) setEnrollmentData(data?.enrollment_date);
    } else if (error) {
      console.error(error?.error);
    }
  }, [data, error]);

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter data by multiple program names if specified
  const filteredData = program_names.length
    ? enrollmentData.filter((program) =>
        program_names.includes(program.program_name)
      )
    : enrollmentData;

  // Handle optional default values
  const defaultData = !enrollmentData
    ? [{ from_date, to_date, message, program_names }]
    : filteredData;

  const handleRequestEnroll = async () => {
    if (!student_id)
      triggerAlert("error", "Error", "Cannot enroll student, it has no id.");
    try {
      const payload = { enrollment_status: "PENDING_REQUEST" };
      const res = await updateData(student_id, payload);

      if (res?.success) {
        triggerAlert(
          "success",
          "Success",
          "Enrollment Successfully Requested"
        );
      } else {
        setStudentExist(false);
      }
    } catch (error) {
      setStudentExist(false);
      console.log(error);
    }
  };

  return (
    <div
      className={`w-full ${
        program_names.length
          ? `max-w-screen-lg mx-auto`
          : `grid grid-cols-1 sm:grid-cols-2 gap-4`
      } text-center`}
    >
      {defaultData.map((program, index) => (
        <div
          key={index}
          className="mb-5 bg-white shadow-lg rounded-[1.875rem] p-5"
        >
          <div className="bg-blue-100 p-3 rounded-md mb-4 text-center">
            <h3 className="text-lg font-semibold text-blue-700">
              {program?.program_name || "Program Name"}
            </h3>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">
              <span className="text-gray-600">Enrollment Period:</span>
            </p>
            <div className="text-lg font-semibold mb-4">
              <span className="text-blue-700">
                {formatDate(program?.from_date) || "Start Date"}
              </span>{" "}
              <span className="text-gray-500">to</span>{" "}
              <span className="text-red-700">
                {formatDate(program?.to_date) || "End Date"}
              </span>
            </div>
          </div>
          <p
            className={`text-sm italic mb-[1rem] ${
              program?.is_enrollment ? "text-green-600" : "text-red-600"
            }`}
          >
            {program?.message || "No message available."}
          </p>
          {show_button && (
            <button
              className={`px-6 py-3 rounded-lg shadow-md transition-all ${
                (program?.is_enrollment || student_status === "WAITLISTED")
                  ? "bg-[#1d3557] text-white hover:bg-[#457b9d]"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              hidden={!program?.is_enrollment || student_status !== "WAITLISTED"}
              onClick={() => {
                if (program?.is_enrollment) {
                  console.log(student_status)
                  handleRequestEnroll();
                }
              }}
            >
              {studentExist ? `Enroll Now` : `Requested`}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnrollmentDate;
