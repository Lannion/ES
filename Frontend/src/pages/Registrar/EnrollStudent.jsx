import React, { useState, useEffect, useLayoutEffect} from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import RegistrarSidebar from "./RegistrarSidebar";
import useData from "../../components/DataUtil";
import { useAlert } from "../../components/Alert";

const EnrollStudent = ({ onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();
  const location = useLocation();

  const {student} = location.state || "No student"
  const [defaultCourses, setDefaultCourses] = useState([])
  const [eligiableCourses, setEligiableCourses] = useState([])
  const [billings, setBillings] = useState([]);
  const {triggerAlert} = useAlert();

  const { studentId } = useParams();
      
  useEffect(()=>{
      if (!studentId) navigate(`/registrar/enrollmentList/`);
  }, [studentId]);

  const { data, error, getData } = useData(`/api/batch/?id=${student?.id}`);

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
    
    useEffect (()=>{
      if(data){
        if(data.default_courses) setDefaultCourses(data.default_courses);
        if(data.eligible_courses) setEligiableCourses(data.eligible_courses);
        if(data.billings) setBillings(data.billings);

        console.log(defaultCourses);
        console.log(eligiableCourses);
      } 
     if (error){
        triggerAlert("error", "Error", error?.data?.error || "Student not eligiable to enroll.")
        navigate(`/registrar/enrollmentList/`);
        console.log(error?.data);
      }
    }, [data, error]);

  const handleProceedToBilling = () => {

    const courseIds = defaultCourses.map(course => course?.id);  // Extract all course IDs

    navigate(`/registrar/billing/${student.id}`, {
    state: { student: student, courses: courseIds, billings: billings } 
    }); // Navigate to the Billing page
  };
  

  const handleAddToPending = () => {
    navigate("/registrar/enroll-student", { state: { updatedStudent: student } });
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev); // Toggle modal visibility
  };

  const removeCourse = (index) => {
    const updatedCourses = defaultCourses.filter((_, i) => i !== index);
    setDefaultCourses(updatedCourses);
  };

  const updateCourse = (index, newCourseData) => {
    const updatedCourses = [...defaultCourses];  // Create a copy of the courses array
    updatedCourses[index] = newCourseData;  // Replace the course at the given index with the new course data
    setDefaultCourses(updatedCourses);  // Set the updated courses back to state
  };    

  const addCourse = () => {
    const newCourse = eligiableCourses.length > 0 ? { ...eligiableCourses[0] } : {}; // Make a copy of the first eligible course or an empty object
    // You can modify the newCourse here, if you need to set specific values (e.g., a new section, title, etc.)
    setDefaultCourses((prevCourses) => [...prevCourses, newCourse]); // Add the new course to the list
  };  

  const backToList = () => {
    navigate(`/registrar/enrollmentList/`)
  };

  return (
    <div className="flex min-h-screen">
      <RegistrarSidebar
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        currentPage={"enroll-student"}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        className={isMobile ? "sidebar-collapsed" : ""}
        />
  
        <div
          className={`flex flex-col items-center flex-1 transition-all duration-300 ${
            isMobile ? "ml-[12rem]" : "ml-[15.625rem] md:ml-[20rem] lg:ml-[0rem]"
          } py-[2rem] px-[1rem] md:px-[2rem] lg:px-[4rem]`}
        >
        <div className="w-full max-w-[87.5rem] px-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">ENROLL STUDENT</h1>

          {/* Student Information Section */}
          <div className="mb-6 p-11 bg-white shadow-lg rounded-[1.875rem]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">STUDENT INFORMATION</h2>
            <table className="w-full text-center border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border-b">STUDENT NUMBER</th>
                  <th className="px-6 py-4 border-b">STUDENT NAME</th>
                  <th className="px-6 py-4 border-b">PROGRAM</th>
                  <th className="px-6 py-4 border-b">YEAR LEVEL</th>
                  <th className="px-6 py-4 border-b">SECTION</th>
                  <th className="px-6 py-4 border-b">SEMESTER</th>
                  <th className="px-6 py-4 border-b">ACADEMIC YEAR</th>
                  <th className="px-6 py-4 border-b">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{student?.id || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.last_name || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.program || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.year_level || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.section || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.semester || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.academic_year || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{student?.status || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Courses Section */}
          <div className="mb-6 p-11 bg-white shadow-lg rounded-[1.875rem]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">COURSES</h2>
              <button onClick={toggleModal} className="bg-green-600 text-white px-4 py-2 rounded-[1.875rem] hover:bg-green-700">
                Edit Courses
              </button>
            </div>
            <table className="w-full text-center border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 border-b" rowSpan="2">COURSE CODE</th>
                  <th className="px-6 py-4 border-b" rowSpan="2">TITLE</th>
                  <th className="px-6 py-4 border-b" colSpan="2">UNIT</th>
                  <th className="px-6 py-4 border-b" colSpan="2">CONTACT HR</th>
                  <th className="px-6 py-4 border-b" rowSpan="2">YEAR LEVEL</th>
                  <th className="px-6 py-4 border-b" rowSpan="2">SEMESTER</th>
                </tr>
                <tr>
                  <th className="px-6 py-4 border-b">LAB</th>
                  <th className="px-6 py-4 border-b">LEC</th>
                  <th className="px-6 py-4 border-b">LAB</th>
                  <th className="px-6 py-4 border-b">LEC</th>
                </tr>
              </thead>
              <tbody>
                {defaultCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{course?.code}</td>
                    <td className="px-6 py-4 border-b">{course?.title}</td>
                    <td className="px-6 py-4 border-b">{course?.lab_units}</td>
                    <td className="px-6 py-4 border-b">{course?.lec_units}</td>
                    <td className="px-6 py-4 border-b">{course?.contact_hr_lab}</td>
                    <td className="px-6 py-4 border-b">{course?.contact_hr_lec}</td>
                    <td className="px-6 py-4 border-b">{course?.year_level}</td>
                    <td className="px-6 py-4 border-b">{course?.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Course Selection */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-xl w-[80%] max-w-[900px]">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">COURSE SELECTION</h2>
                <div className="max-h-[70vh] overflow-y-auto">
                <table className="w-full text-center border-collapse mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 border-b invisible">ACTION</th> {/* Invisible header */}
                      <th className="px-6 py-4 border-b">COURSE</th>
                      <th className="px-6 py-4 border-b">SECTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultCourses.map((course, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {/* Action column (Delete) */}
                        <td className="px-6 py-4 border-b">
                          <button
                            onClick={() => removeCourse(index)} // Function to remove the course
                            className="text-red-600 hover:text-red-800"
                          >
                            <span className="text-xl">✖</span> {/* Red X Icon */}
                          </button>
                        </td>
                        {/* Dropdown for Course Code */}
                        <td className="px-6 py-4 border-b">
                        <select
                          value={course?.code || ""}
                          onChange={(e) => {
                            const selectedCourse = eligiableCourses.find(
                              (courseOption) => courseOption.code === e.target.value
                            );
                            if (selectedCourse) {
                              updateCourse(index, selectedCourse);
                            }
                          }}
                          className="p-2 border rounded-md w-full">
                          {/* Display `defaultCourses` first */}
                          {defaultCourses.map((courseOption, idx) => (
                            <option key={`default-${idx}`} value={courseOption.code}>
                              {courseOption.code}: {courseOption.title} ({courseOption.year_level}-{courseOption.semester})
                            </option>
                          ))}

                          {/* Display `eligiableCourses`, excluding duplicates */}
                          {eligiableCourses
                            .filter(
                              (courseOption) =>
                                !defaultCourses.some((defaultCourse) => defaultCourse.code === courseOption.code)
                            )
                            .map((courseOption, idx) => (
                              <option key={`eligible-${idx}`} value={courseOption.code}>
                                {courseOption.code}: {courseOption.title} ({courseOption.year_level}-{courseOption.semester})
                              </option>
                            ))}
                        </select>

                        </td>
                        {/* Dropdown for Section */}
                        <td className="px-6 py-4 border-b pr-8">
                          <select
                            value={course.section}
                            onChange={(e) => updateCourse(index, "section", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="3">3</option>
                            <option value="4">4</option>
                            {/* Add more section options */}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="flex justify-between">
                  <button onClick={toggleModal} className="px-6 py-3 rounded-md bg-gray-600 text-white">
                    CANCEL
                  </button>
                  <button onClick={toggleModal} className="px-6 py-3 rounded-md bg-green-600 text-white">
                    SAVE
                  </button>
                </div>
                {/* Add Course Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={addCourse} // Function to add a new course
                    className="px-6 py-3 rounded-md bg-blue-600 text-white"
                  >
                    + ADD COURSE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              className="bg-[#595959] text-white px-6 py-3 rounded-[1.875rem] hover:bg-[#afaa6d]"
              onClick={() => backToList()}
              >
              BACK TO LIST
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-[1.875rem] hover:bg-blue-600"
              onClick={handleProceedToBilling} // Navigate to Billing page
            >
              PROCEED TO BILLING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollStudent;
