import React, { useState, useEffect, useLayoutEffect } from "react";
import { FaSearch } from "react-icons/fa";
import RegistrarSidebar from "./RegistrarSidebar";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";
import { useAlert } from "../../components/Alert";
import ChecklistModal from "../../components/ChecklistModal";
import ImportExcelModal from "../../components/ImportExcelModal";

const ListOfStudents = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const studentsPerPage = 10;
  const [filters, setFilters] = useState({
    year_level: "",
    program: "",
    section: "",
    search: "",
  });
  const apiURL = `/api/student/`;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const handleSaveStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student?.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setIsEditModalOpen(false);
  };

  const navigate = useNavigate();
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Custom hook to fetch data from the API
  const { data, error, getData } = useData(apiURL);
  const { triggerAlert } = useAlert();
  const [students, setStudents] = useState([]);

  // Fetching enrollment data for the selected student
  const apiEnrolledUrl = selectedStudent
    ? `/api/enrollment/?student=${selectedStudent?.id}&school_year=${selectedStudent?.academic_year}`
    : null;
  const { data: enrollmentData, getData: getEnrollmentData } =
    useData(apiEnrolledUrl);

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
    if (data) {
      setStudents(data);
    } else if (error) {
      console.error(error?.error);
      triggerAlert("error", "Error", error?.error || "An error occurred");
    }
  }, [data, error]);

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      if (selectedStudent) {
        try {
          await getEnrollmentData();
          setIsEditModalOpen(true);
        } catch (error) {
          console.log("Error: Enrollment data is not available");
        }
      }
    };
    fetchEnrollmentData();
  }, [selectedStudent, getEnrollmentData]);

  const handleRowDoubleClick = (student) => {
    // Reset selectedStudent to null before setting it again
    setSelectedStudent(null); // Reset to allow re-clicking
    setTimeout(() => {
      setSelectedStudent(student); // Set the selected student after a short delay
    }, 0); // Use a timeout to ensure the state updates correctly
  };

  const filteredStudents =
    students?.filter((student) => {
      const matchesYearLevel =
        !filters.year_level ||
        student?.year_level?.toString() === filters.year_level;
      const matchesProgram =
        !filters.program ||
        student?.program?.toLowerCase() === filters.program.toLowerCase();
      const matchesSection =
        !filters.section ||
        student?.section?.toLowerCase() === filters.section.toLowerCase();
      const matchesSearch =
        !filters.search ||
        student?.first_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        student?.last_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        student?.id?.toString().includes(filters.search);

      return (
        matchesYearLevel && matchesProgram && matchesSection && matchesSearch
      );
    }) || [];

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const openModal = () => {
    setIsImportModalOpen(true);
  };

  const closeModal = () => {
    setIsImportModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <RegistrarSidebar
        onLogout={onLogout}
        currentPage="list"
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onNavigate={(section) => {
          if (section === "logout") {
            navigate("/registrar");
          } else if (section === "dashboard") {
            navigate("/registrar/dashboard");
          } else if (section === "enroll") {
            navigate("/registrar/enroll");
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
          <div className="flex justify-between items-center bg-white shadow rounded-[1.875rem] px-8 py-4 mb-6">
            <div className="relative w-[20rem]">
              <input
                type="text"
                placeholder="Search here..."
                className="border border-gray-300 rounded-full px-4 py-2 w-full pl-10 focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <span className="absolute left-4 top-2/4 transform -translate-y-2/4 text-gray-500">
                <FaSearch />
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                name="year_level"
                className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                onChange={(e) =>
                  setFilters({ ...filters, year_level: e.target.value })
                }
                value={filters.year_level}
              >
                <option value="">Year Level</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <select
                name="program"
                className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                onChange={(e) =>
                  setFilters({ ...filters, program: e.target.value })
                }
                value={filters.program}
              >
                <option value="">Course</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
              </select>
              <select
                name="section"
                className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                onChange={(e) =>
                  setFilters({ ...filters, section: e.target.value })
                }
                value={filters.section}
              >
                <option value="">Section</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          <div className="bg-white shadow rounded-[1.875rem] p-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-[1.875rem] font-semibold text-gray-800">
                List Of Students
              </h1>
              <div className="flex gap-4">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700" onClick={openModal}>
                Import as Excel
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Export as Excel
              </button>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-4 border-b">Student Number</th>
                  <th className="px-6 py-4 border-b">Student Name</th>
                  <th className="px-6 py-4 border-b">Course</th>
                  <th className="px-6 py-4 border-b">Year Level</th>
                  <th className="px-6 py-4 border-b">Section</th>
                  <th className="px-6 py-4 border-b">Semester</th>
                  <th className="px-6 py-4 border-b">Academic Year</th>
                  <th className="px-6 py-4 border-b">Status</th>
                  <th className="px-6 py-4 border-b">Enrollment Status</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr
                    key={student?.id}
                    className="hover:bg-gray-50 text-center"
                    onDoubleClick={() => handleRowDoubleClick(student)}
                  >
                    <td className="px-6 py-4 border-b">{student?.id}</td>
                    <td className="px-6 py-4 border-b">
                      {student?.last_name}, {student?.first_name}{" "}
                      {student?.middle_name}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student?.program || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student?.year_level || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student?.section || "TBA"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student?.semester || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student?.academic_year || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student?.status || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`${
                          student?.enrollment_status?.toLowerCase() ===
                          "enrolled"
                            ? `bg-green-100 text-green-700`
                            : `bg-red-100 text-red-700`
                        } px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {student?.enrollment_status || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p>
                Page {currentPage} of{" "}
                {Math.ceil(filteredStudents.length / studentsPerPage)}
              </p>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
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
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col items-center mb-[6rem] sm:mb-0">
          <ChecklistModal
            student_id={selectedStudent.id}
            onClose={closeEditModal}
            isEditable={true}
          />
        </div>
      )}
      {isImportModalOpen && (
        <ImportExcelModal
          isOpen={openModal}
          onClose={closeModal}
          excelType={"grades"}
        />
      )}
    </div>
  );
};

export default ListOfStudents;
