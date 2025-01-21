import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MissionIcon from "../../images/Student/DashboardIcons/Mission.svg";
import VisionIcon from "../../images/Student/DashboardIcons/Vision.svg";
import ProfileIcon from "../../images/Student/DashboardIcons/ProfileIcon.svg";
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";
import EnrollmentDate from "../../components/EnrollmentDate";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  // State to track the active section
  const [currentSection, setCurrentSection] = useState("dashboard");

  // Fetch student data
  const { data, error, getData } = useData("/api/student/");
  const [student, setStudent] = useState({
    id: "",
    first_name: "",
    full_name: "", 
    program: "",
    enrollment_status: "",
    student_status: "", 
  });
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Fetch student data on component mount
    const fetchData = async () => {
      await getData(); // Fetch data
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Update the `student` state when `data` changes
    if (data) {
      const studentInstance =  data[0]
      setStudent({
        id: studentInstance.id,
        first_name: studentInstance.first_name,
        full_name: `${studentInstance.last_name}, ${studentInstance.first_name} ${studentInstance.middle_name}`,
        program: `${studentInstance.program} ${studentInstance.year_level}-${studentInstance.section || "TBA"}`,
        enrollment_status: studentInstance.enrollment_status || "Not enrolled yet.",
        student_status: studentInstance.status || "Not enrolled yet.",
        program_id: studentInstance?.program,
      }); // Assuming the first item in the data array is the student
      console.log(student)
    } else if(error){
      setFetchError(error.response);
      console.log(fetchError);
    }
  }, [data]);

  const handleNavigate = (section) => {
    setCurrentSection(section); // Update the current section
    switch (section) {
      case "dashboard":
        navigate("/student/dashboard");
        break;
      case "profile":
        navigate("/student/profile");
        break;
      case "cor":
        navigate("/student/cor");
        break;
      case "checklist":
        navigate("/student/checklist");
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-screen min-h-screen lg:h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0] flex flex-col lg:flex-row overflow-hidden">
      <Sidebar onNavigate={handleNavigate} activeSection={currentSection} />
    <div className="flex-1 flex flex-col">
      <Header onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 lg:h-[calc(100%-4rem)]">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1000px] mt-2 lg:mt-3">
          <h2 className="text-[2rem] font-extrabold text-center uppercase text-[#1d3557] mb-1 tracking-wide">
            Welcome! <span className="bg-blue-100 p-3 rounded-md mb-4 text-center text-blue-700">{student.first_name}</span>
          </h2>
          <p className="text-[#555] text-[1rem] sm:text-[1.125rem] mt-2 md:mt-0 text-center md:text-left">
            Enrollment Status: <span className="font-bold">{student?.enrollment_status}</span>
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[1000px] md:rounded-[34px] flex flex-col sm:flex-row items-center sm:items-start md:items-center p-4 md:p-6 my-4 lg:my-6 relative">
          {/* Profile Icon */}
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-4 sm:mb-0">
            <img
              src={ProfileIcon}
              alt="Profile Icon"
              className="h-[3.75rem] w-[3.75rem] sm:h-[4.5rem] sm:w-[4.5rem] md:h-[5.625rem] md:w-[5.625rem] mr-4 sm:mr-6"
            />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col text-center sm:text-left w-full sm:w-auto">
            <h3 className="text-[#222] font-bold text-[1.125rem] sm:text-[1.25rem] md:text-[1.5rem]">
              {student.full_name}
            </h3>
            <p className="text-[#666] text-[0.875rem] sm:text-[1rem] md:text-[1.125rem] font-regular">
              {student.program}
            </p>
            <p className="text-[#666] text-[0.875rem] sm:text-[1rem] md:text-[1.125rem] font-regular">
              {student.id}
            </p>
          </div>

          {/* Status */}
          <div className="absolute bottom-4 right-4 md:right-6 md:bottom-6 text-[#888] text-[0.875rem] sm:text-[1rem] md:text-[1.125rem]">
            <p>
              Status: <span className="font-bold">{student.student_status}</span>
            </p>
          </div>
        </div>

        {/* Mission and Vision Cards */}
        <div className="flex flex-col md:flex-row justify-between gap-6 w-full max-w-[1000px]">
          {/* Mission Card */}
          <div className="bg-white shadow-lg rounded-[20px] md:rounded-[34px] p-4 sm:p-6 lg:p-8 w-full md:w-[48%] text-center">
            <img
              src={MissionIcon}
              alt="Mission Icon"
              className="h-[1rem] w-[1rem] sm:h-[1.5rem] sm:w-[1.5rem] lg:h-[3rem] lg:w-[3rem] mb-2 lg:mb-3 mx-auto"
            />
            <h3 className="text-[#222] font-bold text-[1rem] sm:text-[1rem] lg:text-[1rem] mb-2 lg:mb-4">
              CVSU MISSION
            </h3>
            <p className="text-[#555] text-[1rem] sm:text-[1rem] lg:text-[1rem] leading-relaxed">
              Cavite State University shall provide excellent, equitable, and
              relevant educational opportunities in the arts, sciences, and
              technology through quality instruction and responsive research and
              development activities.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white shadow-lg rounded-[20px] md:rounded-[34px] p-4 sm:p-6 lg:p-8 w-full md:w-[48%] mb-16 sm:mb-4 lg:mb-0 text-center">
            <img
              src={VisionIcon}
              alt="Vision Icon"
              className="h-[1rem] w-[1rem] sm:h-[1.5rem] sm:w-[1.5rem] lg:h-[3rem] lg:w-[3rem] mb-2 lg:mb-3 mx-auto"
            />
            <h3 className="text-[#222] font-bold text-[1rem] sm:text-[1rem] lg:text-[1rem] mb-2 lg:mb-4">
              CVSU VISION
            </h3>
            <p className="text-[#555] text-[1rem] sm:text-[1rem] lg:text-[1rem] leading-relaxed">
              Cavite State University aspires to be a globally recognized
              research university that provides excellent and relevant education
              for the sustainable development of individuals and communities.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-lg mx-auto bg-white shadow-lg rounded-[1.875rem] p-[1.5rem] mb-[1.5rem] flex flex-wrap items-center justify-evenly gap-4">
        <EnrollmentDate program_names={[student?.program_id]} show_button={true} student_id={student.id} student_status={student.enrollment_status}/>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;