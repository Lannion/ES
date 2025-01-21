import React, { useState, useEffect } from "react";
import Header from "./Header"; // Custom Header
import Sidebar from "./Sidebar"; // Custom Sidebar
import { useNavigate } from "react-router-dom";
import useData from "../../components/DataUtil";
import ChecklistModal from "../../components/ChecklistModal";

const Checklist = ({ onLogout, student_id }) => {
  const navigate = useNavigate();

  // State to track the active section
  const [currentSection, setCurrentSection] = useState("checklist");

  const { data, error, getData } = useData(`/api/checklist/${student_id ? `?student=${student_id}`: ``}`);
  const [student, setStudent] = useState(null);
  const [courseGrade, setCourseGrade] = useState([]);

  // State for selected filters
  const [selectedYearLevel, setSelectedYearLevel] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);

  useEffect(() => {
    // Fetch student and course data on component mount
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [getData]);

  useEffect(() => {
    // Update state when data changes
    if (data) {
      if (data.student) {
        setStudent(data.student);
      }
      if (data.courses_and_grades) {
        setCourseGrade(data.courses_and_grades);
      }
    } else if (error) {
      console.error(error?.error);
    }
  }, [data, error]);

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

  // Update dropdown state for Year Level
  const handleYearLevelChange = (e) => {
    const yearLevel = parseInt(e.target.value, 10);
    setSelectedYearLevel(yearLevel);
    setStudent((prev) => ({
      ...prev,
      year_level: yearLevel,
    }));
  };

  // Update dropdown state for Semester
  const handleSemesterChange = (e) => {
    const semester = parseInt(e.target.value, 10);
    setSelectedSemester(semester);
    setStudent((prev) => ({
      ...prev,
      semester: semester,
    }));
  };

  // Filter courses based on selected year level and semester
  const filteredCourses = courseGrade.filter(courseData => 
    courseData.course.year_level === selectedYearLevel && 
    courseData.course.semester === selectedSemester
  );

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[#e4ecfa] to-[#fefae0] flex flex-col">
      {/* Header */}
      <Header onLogout={onLogout} />

      <div className="flex flex-1 lg:h-[calc(100%-4rem)] overflow-y-auto">
        {/* Sidebar */}
        <Sidebar onNavigate={handleNavigate} activeSection={currentSection} />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col items-center mb-[6rem] sm:mb-0">
          <ChecklistModal isEditable={false}/>
        </div>
      </div>
    </div>
  );
};

export default Checklist;