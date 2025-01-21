import React, { useState, useLayoutEffect, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DepartmentSidebar from "./DepartmentSidebar";
import InformationModal from "../../components/InformationModal";
import DepartmentAddInstructor from "./DepartmentAddInstructor";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";

const DepartmentInstructorList = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isAddInstructorModalOpen, setIsAddInstructorModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const instructorsPerPage = 10;
  const navigate = useNavigate();

  const apiURL = `/api/instructor/`;
  const { data, error, getData, updateData } = useData(apiURL);
  const [instructors, setInstructors] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    province: "",
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
      setInstructors(data);
    } else if (error) {
      console.error(error?.error);
    }
  }, [data, error, updateData]);

  const handleRowDoubleClick = (instructor) => {
    setSelectedInstructor(instructor);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSaveInstructor = (updatedInstructor) => {
    setInstructors((prev) =>
      prev.map((instructor) =>
        instructor?.id === updatedInstructor.id ? updatedInstructor : instructor
      )
    );
    setIsEditModalOpen(false);
  };

  const handleAddInstructor = () => {
    window.location.reload();
    setIsAddInstructorModalOpen(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredInstructors = Array.isArray(instructors) // Check if instructors is an array
    ? instructors
        .filter((instructor) => instructor != null) // Remove null or undefined instructors
        .filter((instructor) => {
          const matchesSearch =
            !filters.search ||
            instructor?.first_name
              ?.toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            instructor?.last_name
              ?.toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            instructor?.id?.toString().includes(filters.search);

          const matchesCity =
            !filters.city ||
            instructor?.address?.city?.toLowerCase() ===
              filters.city.toLowerCase();

          const matchesProvince =
            !filters.province ||
            instructor?.address?.province?.toLowerCase() ===
              filters.province.toLowerCase();

          return matchesSearch && matchesCity && matchesProvince;
        })
    : [];

  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
  );

  return (
    <div className="flex min-h-screen">
      <DepartmentSidebar
        onLogout={onLogout}
        currentPage="instructor"
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
          isMobile
            ? currentInstructors.length > 0
              ? "ml-[18rem]"
              : "ml-[6rem]"
            : "ml-[15.625rem] md:ml-[19rem] lg:ml-[0rem]"
        } py-[2rem] px-[1rem] md:px-[2rem] lg:px-[4rem] ${
          currentInstructors.length > 0 ? "max-w-[70rem]" : "max-w-[87.5rem]"
        }`}
      >
        <div className="w-full max-w-[87.5rem] px-4 sm:px-6">
          <div className="flex flex-wrap md:flex-nowrap flex-col md:flex-row justify-between items-center bg-white shadow-lg rounded-[1.875rem] px-4 sm:px-6 py-4 mb-4 sm:mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:gap-4 w-full items-center gap-4 md:justify-between">
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
              <div className="flex gap-4">
                <select
                  name="city"
                  className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                  value={filters.city}
                >
                  <option value="">City</option>
                  {instructors == null ? (
                    Array.from(
                      new Set(
                        instructors.map(
                          (instructor) => instructor?.address?.city
                        )
                      )
                    ).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))
                  ) : (
                    <option>City</option>
                  )}
                </select>
                <select
                  name="province"
                  className="border border-gray-300 rounded-full px-4 py-2 pr-8"
                  onChange={(e) =>
                    setFilters({ ...filters, province: e.target.value })
                  }
                  value={filters.province}
                >
                  <option value="">Province</option>
                  {instructors == null ? (
                    Array.from(
                      new Set(
                        instructors.map(
                          (instructor) => instructor?.address?.province
                        )
                      )
                    ).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))
                  ) : (
                    <option>Province</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-[1.875rem] p-4 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Instructor List
              </h1>
              <div className="flex items-center space-x-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded-[1.875rem] hover:bg-green-700">
                  Export as Excel
                </button>
              </div>
            </div>

            <div className="bg-blue-100 p-3 rounded-md mb-4 text-center">
              <h3 className="text-lg font-semibold text-blue-700">
                {" "}
                Number of Instructors: {filteredInstructors.length}
              </h3>
            </div>

            <div className="text-gray-400 italic mb-4 ">
              Double-click a row to view its details.
            </div>

            {/* <div className="overflow-x-auto md:overflow-x-hidden"> */}
            <table className="w-full text-center border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border-b">Instructor ID</th>
                  <th className="px-6 py-4 border-b">Instructor Name</th>
                  <th className="px-6 py-4 border-b">Email</th>
                  <th className="px-6 py-4 border-b">Contact No.</th>
                  <th className="px-6 py-4 border-b">Address</th>
                </tr>
              </thead>
              <tbody>
                {currentInstructors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 border-b text-center">
                      No current instructors found.
                    </td>
                  </tr>
                ) : (
                  currentInstructors.map((instructor) => (
                    <tr
                      key={instructor?.id}
                      className="hover:bg-gray-50 text-center cursor-pointer"
                      onDoubleClick={() => handleRowDoubleClick(instructor)}
                    >
                      <td className="px-6 py-4 border-b">{instructor?.id}</td>
                      <td className="px-6 py-4 border-b">
                        {instructor?.last_name}, {instructor?.first_name}{" "}
                        {instructor?.middle_name || ""}
                      </td>
                      <td className="px-6 py-4 border-b">
                        {instructor?.email || "-"}
                      </td>
                      <td className="px-6 py-4 border-b">
                        {instructor?.contact_number || "-"}
                      </td>
                      <td className="px-6 py-4 border-b">
                        {instructor?.address
                          ? `${instructor?.address.city || "-"}, ${
                              instructor?.address.province || "-"
                            }`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* </div> */}

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
                {Math.ceil(filteredInstructors.length / instructorsPerPage)}
              </p>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredInstructors.length / instructorsPerPage)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedInstructor && (
        <InformationModal
          url={apiURL}
          data={selectedInstructor}
          onClose={closeEditModal}
          onSave={handleSaveInstructor}
          isEditable={false}
        />
      )}
      {isAddInstructorModalOpen && (
        <DepartmentAddInstructor
          onClose={() => setIsAddInstructorModalOpen(false)}
          onSave={handleAddInstructor}
        />
      )}
    </div>
  );
};

export default DepartmentInstructorList;
