import React, { useState, useEffect, useLayoutEffect } from "react";
import { FaSearch } from "react-icons/fa";
import RegistrarSidebar from "./RegistrarSidebar";
import { useNavigate } from "react-router-dom";
import RegistrarRegisterForm from "./RegistrarRegisterForm";
import LimitStudentsModal from "./LimitStudentsModal";
import useData from "../../components/DataUtil";
import { useAlert } from "../../components/Alert";

const EnrollmentList = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  const [studentLimit, setStudentLimit] = useState(0);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    year_level: "",
    program: "",
    section: "",
    search: "",
  });
  const { triggerAlert } = useAlert();

  const handleLimitModal = () => setIsLimitModalOpen(true);
  const closeLimitModal = () => setIsLimitModalOpen(false);

  const handleSaveLimit = (newLimit) => {
    setStudentLimit(newLimit);
    setIsLimitModalOpen(false);
  };

  const { data, error, getData } = useData(
    "/api/student/?enrollment_status=PENDING_REQUEST"
  );

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch student data on component mount
    const fetchData = async () => {
      await getData(); // Fetch data
    };
    fetchData();
  }, [getData]);

  useEffect(() => {
    if (data) {
      setStudents(data);
    } else if (error) {
      console.log(error.response);
    }
  }, [data]);

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle student enrollment
  const handleEnrollment = (studentId) => {
    const selectedStudent = students.find(
      (student) => student.id === studentId
    );
    // console.log(selectedStudent.id);
    navigate(`/registrar/enroll-student/${selectedStudent?.id}`, {
      state: { student: selectedStudent },
    });
  };

  // Filter students based on selected filters
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

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Handle the opening and closing of modals
  const handleAddStudent = () => setIsAddStudentModalOpen(true);

  const handleConfirmAddStudent = (newStudent) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setIsAddStudentModalOpen(false);
  };
  const closeAddStudentModal = () => setIsAddStudentModalOpen(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0]">
      {/* Sidebar */}
      <RegistrarSidebar
        onLogout={onLogout}
        currentPage="enroll"
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        className={isMobile ? "sidebar-collapsed" : ""}
      />

      <div
        className={`flex flex-col items-center flex-1 transition-all duration-300 ${
          isMobile ? "ml-[12rem]" : "ml-[15.625rem] md:ml-[20rem] lg:ml-[0rem]"
        } py-[2rem] px-[1rem] md:px-[2rem] lg:px-[4rem]`}
      >
        <div className="w-full max-w-[87.5rem] px-6">
          {/* Search and Filter Section */}
          <div className="flex flex-wrap justify-between items-center bg-white shadow-lg rounded-[1.875rem] px-8 py-4 mb-6">
            <div className="relative w-full max-w-[20rem]">
              <input
                type="text"
                placeholder="Search here..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="border border-gray-300 rounded-full px-4 py-2 w-full pl-10 focus:ring-2 focus:ring-blue-500"
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

          {/* Student List */}
          <div className="bg-white shadow-lg rounded-[1.875rem] p-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Enrollment List
              </h1>
              <div className="flex items-center space-x-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded-[1.875rem] hover:bg-green-700">
                  Export as Excel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-[1.875rem] hover:bg-indigo-700"
                  onClick={handleAddStudent}
                >
                  + Add Student
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-[1.875rem] hover:bg-blue-700"
                  onClick={handleLimitModal}
                >
                  Limit Students
                </button>
              </div>
            </div>

            <table className="w-full text-center border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border-b">Student Number</th>
                  <th className="px-6 py-4 border-b">Student Name</th>
                  <th className="px-6 py-4 border-b">Course</th>
                  <th className="px-6 py-4 border-b">Year Level</th>
                  <th className="px-6 py-4 border-b">Section</th>
                  <th className="px-6 py-4 border-b">Enrollment Status</th>
                  <th className="px-6 py-4 border-b">Enroll</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{student.id}</td>
                    <td className="px-6 py-4 border-b">
                      {student.last_name}, {student.first_name}{" "}
                      {student.middle_name || ""}
                    </td>
                    <td className="px-6 py-4 border-b">{student.program}</td>
                    <td className="px-6 py-4 border-b">{student.year_level}</td>
                    <td className="px-6 py-4 border-b">
                      {student.section || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {student.enrollment_status}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 w-[150px] rounded-full hover:bg-blue-700"
                        onClick={() => handleEnrollment(student.id)}
                      >
                        Enroll Student
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
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

      {/* Modals */}
      {isAddStudentModalOpen && (
        <RegistrarRegisterForm onClose={closeAddStudentModal} />
      )}
      {isLimitModalOpen && (
        <LimitStudentsModal
          currentLimit={studentLimit}
          onClose={closeLimitModal}
          onSave={handleSaveLimit}
        />
      )}
    </div>
  );
};

export default EnrollmentList;
