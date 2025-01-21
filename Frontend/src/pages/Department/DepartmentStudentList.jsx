import React, { useState, useLayoutEffect, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DepartmentSidebar from "./DepartmentSidebar";
import InformationModal from "../../components/InformationModal";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";
import exportStudentData from "../../functions/ExportExcel";

const DepartmentStudentList = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentsPerPage = 10;

  const apiURL = `/api/student/`;
  const { data, error, getData, updateData } = useData(apiURL);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    yearLevel: "",
    program: "",
    section: "",
    enrollment_status: "",
  });

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [getData]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setStudents(data);
    } else if (error) {
      console.error(error?.error);
    }
  }, [data, error, updateData]);

  const handleRowDoubleClick = (student) => {
    setSelectedStudent(student);
    console.log(student);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSaveStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student?.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setIsEditModalOpen(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper: Get unique year levels
  const getUniqueYearLevels = () => {
    const yearLevels = students
      .filter(
        (student) => !filters.program || student?.program === filters.program // Include all if program is not selected
      )
      .map((student) => student?.year_level)
      .filter(Boolean);
    return [...new Set(yearLevels)];
  };

  // Helper: Get unique sections
  const getUniqueSections = () => {
    const sections = students
      .filter(
        (student) =>
          (!filters.program || student?.program === filters.program) && // Include all if program is not selected
          (!filters.yearLevel ||
            student?.year_level === parseInt(filters.yearLevel))
      )
      .map((student) => student?.section)
      .filter(Boolean);
    return [...new Set(sections)];
  };

  const filteredStudents =
    students?.filter((student) => {
      const matchesSearch =
        !filters.search ||
        student?.first_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        student?.last_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        student?.id?.toString().includes(filters.search);

      const matchesYearLevel =
        !filters.yearLevel ||
        student?.year_level === parseInt(filters.yearLevel);

      const matchesProgram =
        !filters.program || student?.program === filters.program;

      const matchesSection =
        !filters.section || student?.section === filters.section;

      const matchesEnrollmentStatus =
        !filters.enrollment_status ||
        student?.enrollment_status === filters.enrollment_status;

      return (
        matchesSearch &&
        matchesYearLevel &&
        matchesProgram &&
        matchesSection &&
        matchesEnrollmentStatus
      );
    }) || [];

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handleEnrollment = (student) => {
    console.log(student); // Log the student for debugging
    navigate(`/department/evaluate-student/${student?.id}`, {
      state: { student },
    });
  };

  const color = [`red`, `blue`, `yellow`, `green`];
  const enrollmentStatus = [
    `NOT_ENROLLED`,
    `WAITLISTED`,
    `PENDING_REQUEST`,
    `ENROLLED`,
  ];

  const handleExport = async () => {
    try {
      const data = await exportStudentData(
        filters.yearLevel,
        filters.section,
        filters.program
      );
      // Handle the exported data (e.g., download as Excel)
    } catch (error) {
      console.error('Error exporting student data:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DepartmentSidebar
        onLogout={onLogout}
        currentPage="schedule"
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onNavigate={(section) => {
          switch (section) {
            case "logout":
              navigate("/department");
              break;
            case "enroll":
              navigate("/departmentDashboard/enroll");
              break;
            case "list":
              navigate("/departmentDashboard/list");
              break;
            case "account":
              navigate("/departmentDashboard/account");
              break;
            default:
              break;
          }
        }}
        className={isMobile ? "sidebar-collapsed" : ""}
      />

      <div
        className={`flex flex-col items-center flex-1 transition-all duration-300 ${
          isMobile ? "ml-[12rem]" : "ml-[15.625rem] md:ml-[20rem] lg:ml-[0rem]"
        } py-[2rem] px-[1rem] md:px-[2rem] lg:px-[4rem]`}
      >
        <div className="w-full max-w-[87.5rem] px-6">
          <div className="flex flex-wrap md:flex-nowrap flex-col md:flex-row justify-between items-center bg-white shadow-lg rounded-[1.875rem] px-4 sm:px-6 py-4 mb-4 sm:mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:gap-4 w-full items-center gap-4">
              <div className="relative flex items-center w-[20rem] border border-gray-300 rounded-full px-4 py-1">
                <div className="flex-shrink-0 text-gray-500">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="ml-2 w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap md:flex-nowrap flex-col md:flex-row items-center gap-4 sm:gap-4 md:ml-auto">
                <select
                  className="border border-gray-300 rounded-full px-4 py-2 pr-8 w-full sm:w-auto"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      program: e.target.value,
                      yearLevel: "",
                      section: "",
                    })
                  }
                  value={filters.program}
                >
                  <option value="">Select Course</option>
                  <option>BSIT</option>
                  <option>BSCS</option>
                </select>
                <select
                  className="border border-gray-300 rounded-full px-4 py-2 pr-8 w-full sm:w-auto"
                  onChange={(e) =>
                    setFilters({ ...filters, yearLevel: e.target.value })
                  }
                  value={filters.yearLevel}
                >
                  <option value="">Select Year Level</option>
                  {getUniqueYearLevels().map((yearLevel) => (
                    <option key={yearLevel} value={yearLevel}>
                      {yearLevel}
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-full px-4 py-2 pr-8 w-full sm:w-auto"
                  onChange={(e) =>
                    setFilters({ ...filters, section: e.target.value })
                  }
                  value={filters.section}
                >
                  <option value="">Select Section</option>
                  {getUniqueSections().map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-[1.875rem] p-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Department Student List
              </h1>
              <div className="flex items-center space-x-4">
                <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-[1.875rem] hover:bg-green-700">
                  Export as Excel
                </button>
                <select
                  className="border border-gray-300 rounded-full px-4 py-2 pr-8 w-full sm:w-auto"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      program: "",
                      yearLevel: "",
                      section: "",
                      enrollment_status: e.target.value,
                    })
                  }
                  value={filters.enrollment_status}
                >
                  <option value="">Select Enrollment Status</option>
                  <option>ENROLLED</option>
                  <option>NOT_ENROLLED</option>
                  <option>WAITLISTED</option>
                </select>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-md mb-4 text-center">
              <h3 className="text-lg font-semibold text-blue-700">
                Number of Students: {filteredStudents.length}
              </h3>
            </div>

            <div className="text-gray-400 italic mb-4 flex justify-between">
              <span>Double-click a row to edit its details.</span>
              <span>
                You can also verify students for enrollment when they are marked
                as
                <span
                  className={`inline-block w-2 h-2 bg-yellow-500 rounded-full ml-2`}
                ></span>
                <span className="text-yellow-500">yellow</span>.
              </span>
            </div>

            <table className="w-full text-center border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border-b">Student Number</th>
                  <th className="px-6 py-4 border-b">Student Name</th>
                  <th className="px-6 py-4 border-b">Program</th>
                  <th className="px-6 py-4 border-b">Year Level</th>
                  <th className="px-6 py-4 border-b">Semester</th>
                  <th className="px-6 py-4 border-b">Section</th>
                  {/* {filteredStudents.some((student) => student?.enrollment_status === "PENDING_REQUEST") && (
                    <th className="px-6 py-4 border-b">Approve Enrollment</th>
                  )} */}
                </tr>
              </thead>
              <tbody>
                {currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 border-b text-center">
                      No current students found.
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr
                      key={student?.id}
                      className={`${
                        (student?.status !== "REGULAR" &&
                          student?.enrollment_status === "NOT_ENROLLED") ||
                        student?.enrollment_status === "NOT_ENROLLED"
                          ? `bg-${color[2]}-400`
                          : ``
                      } ${
                        (student?.status !== "REGULAR" &&
                          student?.enrollment_status === "NOT_ENROLLED") ||
                        student?.enrollment_status === "NOT_ENROLLED"
                          ? `hover:bg-${color[2]}-100`
                          : `hover:bg-gray-100`
                      } cursor-pointer`}
                      onDoubleClick={() => handleRowDoubleClick(student)}
                    >
                      <td className="px-6 py-4 border-b">
                        <span
                          className={`inline-block w-2 h-2 bg-${
                            color[
                              enrollmentStatus.indexOf(
                                student?.enrollment_status
                              )
                            ]
                          }-500 rounded-full mr-2`}
                        ></span>
                        {student?.id}
                      </td>
                      <td className="px-6 py-4 border-b">
                        {`${student?.last_name}, ${student?.first_name}`}
                      </td>
                      <td className="px-6 py-4 border-b">{student?.program}</td>
                      <td className="px-6 py-4 border-b">
                        {student?.year_level}
                      </td>
                      <td className="px-6 py-4 border-b">
                        {student?.semester}
                      </td>
                      <td className="px-6 py-4 border-b">
                        {student?.section || "TBA"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex flex-wrap justify-center md:justify-between items-center mt-6 gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p className="text-center">
                Page {currentPage} of{" "}
                {Math.ceil(filteredStudents.length / studentsPerPage)}
              </p>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredStudents.length / studentsPerPage)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <InformationModal
          url={apiURL}
          data={selectedStudent}
          onClose={closeEditModal}
          onSave={handleSaveStudent}
          onEnroll={handleEnrollment}
          neededAdvising={
            selectedStudent?.enrollmentStatus !== "REGULAR" &&
            selectedStudent?.enrollment_status === "NOT_ENROLLED"
          }
          enrollment={true}
        />
      )}
    </div>
  );
};

export default DepartmentStudentList;
