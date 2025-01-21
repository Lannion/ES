import React, { useState, useLayoutEffect, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DepartmentSidebar from "./DepartmentSidebar";
import InformationModal from "../../components/InformationModal";
import DepartmentAddCourse from "./DepartmentAddCourse";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";

const DepartmentMasterList = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  // const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const coursesPerPage = 10;

  const apiURL = `/api/course/`;
  const { data, error, getData, updateData } = useData(apiURL);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    yearLevel: "",
    program: "",
    semester: "",
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
    if (data) {
      setCourses(data);
    } else if (error) {
      console.error(error?.error);
    }
  }, [data, error, updateData]);

  const handleRowDoubleClick = (course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSaveCourse = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((course) =>
        course?.id === updatedCourse.id ? updatedCourse : course
      )
    );
    setIsEditModalOpen(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        !filters.search ||
        course?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        course?.code?.includes(filters.search);

      const matchesYearLevel =
        !filters.yearLevel ||
        course?.year_level === parseInt(filters.yearLevel);

      const matchesProgram =
        !filters.program || course?.program === filters.program;

      const matchesSemester =
        !filters.semester || course?.semester === parseInt(filters.semester);

      return (
        matchesSearch && matchesYearLevel && matchesProgram && matchesSemester
      );
    }) || [];

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  return (
    <div className="flex min-h-screen">
      <DepartmentSidebar
        onLogout={onLogout}
        currentPage="course"
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

            <div className="flex items-center gap-4">
              <select
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
                className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                onChange={(e) =>
                  setFilters({ ...filters, yearLevel: e.target.value })
                }
                value={filters.yearLevel}
              >
                <option value="">Year Level</option>
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
                <option>4th</option>
              </select>
              <select
                className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                onChange={(e) =>
                  setFilters({ ...filters, semester: e.target.value })
                }
                value={filters.semester}
              >
                <option value="">Semester</option>
                <option>1</option>
                <option>2</option>
              </select>
            </div>
          </div>

          <div className="shadow rounded-[1.875rem] bg-white p-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-[1.875rem] font-semibold text-gray-800">
                Curriculum
              </h1>
              <div className="flex gap-4">
                <button className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-700 transition-transform transform hover:scale-105">
                  Export as Excel
                </button>
                {/* <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                  onClick={() => setIsAddCourseModalOpen(true)}
                >
                  + Add Course
                </button> */}
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-md mb-4 text-center">
              <h3 className="text-lg font-semibold text-blue-700">
                {" "}
                Number of Courses: {filteredCourses.length}
              </h3>
            </div>
            <div className="text-gray-400 italic mb-4 ">
              Double-click a row to view its details.
            </div>
            <table className="w-full border-collapse text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border-b">Course Code</th>
                  <th className="px-6 py-4 border-b">Course Title</th>
                  <th className="px-6 py-4 border-b">Program</th>
                  <th className="px-6 py-4 border-b">Year Level</th>
                  <th className="px-6 py-4 border-b">Semester</th>
                  <th className="px-6 py-4 border-b">Lecture Units</th>
                  <th className="px-6 py-4 border-b">Lab Units</th>
                  <th className="px-6 py-4 border-b">Contact Hours (Lec)</th>
                  <th className="px-6 py-4 border-b">Contact Hours (Lab)</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 border-b text-center">
                      No current courses found.
                    </td>
                  </tr>
                ) : (
                  currentCourses.map((course) => (
                    <tr
                      key={course?.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onDoubleClick={() => handleRowDoubleClick(course)}
                    >
                      <td className="px-6 py-4 border-b text-center">
                        {course?.code}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.title}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.program}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.year_level}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.semester}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.lec_units}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.lab_units}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.contact_hr_lec}
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        {course?.contact_hr_lab}
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
                {Math.ceil(filteredCourses.length / coursesPerPage)}
              </p>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredCourses.length / coursesPerPage)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedCourse && (
        <InformationModal
          url={apiURL}
          data={selectedCourse}
          onClose={closeEditModal}
          onSave={handleSaveCourse}
          isEditable={false}
        />
      )}
      {/* {isAddCourseModalOpen && (
        <DepartmentAddCourse
          onClose={() => setIsAddCourseModalOpen(false)}
          onSave={() => {}}
        />
      )} */}
    </div>
  );
};

export default DepartmentMasterList;
