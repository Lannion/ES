import React, { useState, useEffect, useLayoutEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ProfileIcon from "../images/Department/DashboardIcons/ProfileIcon.svg";
import StudentIcon from "../images/Registrar/DashboardIcons/StudentIcon.svg";
import IrregularIcon from "../images/Registrar/DashboardIcons/IrregularIcon.svg";
import useData from "./DataUtil";
import EnrollmentDate from "./EnrollmentDate";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ onLogout, role }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { data, error, getData } = useData("/api/dashboard/");
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [program, setProgram] = useState("BSCS");

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      console.log(data.user);
      if (data.user) setUserData(data.user);
      if (data.dashboard) setDashboardData(data.dashboard);
      console.log(dashboardData?.enrollment_date);
    } else if (error) {
      console.error(error?.error);
    }
  }, [data, error]);

  // Data for the pie chart
  const pieData = {
    labels: ["Enrolled", "Not Enrolled", "Waitlisted", "Pending Request"],
    datasets: [
      {
        label: "Students",
        data: [
          dashboardData?.enrolled_students || 0,
          dashboardData?.not_enrolled_students || 0,
          dashboardData?.waitlisted_students || 0,
          dashboardData?.pending_request_students || 0,
        ],
        backgroundColor: ["#22C55E", "#EF4444", "#3B82F6", "#FACC15"],
        borderWidth: 1,
      },
    ],
  };

  const noData = {
    labels: ["No Student"],
    datasets: [
      {
        label: "No Student",
        data: [1],
        backgroundColor: ["#9CA3AF"],
        borderWidth: 1,
      },
    ],
  };

  const hasData = pieData.datasets[0].data.some((value) => value > 0);

  // Pie chart options
  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const name = [userData?.first_name, userData?.last_name];
  const hasName = name.some((value) => value !== null && value !== undefined && value !== "");  

  return (
    <div
      className={`flex flex-col items-center flex-1 transition-all duration-300 ${
        isMobile
          ? "ml-[5rem] sm:ml-[0rem]" // No margin when sidebar is collapsed or on mobile view
          : "ml-[15.625rem] md:ml-[18rem] lg:ml-[0rem]" // Adjusted margin for expanded sidebar (desktop/tablet)
      } py-[2rem] px-[1rem] md:px-[2rem] lg:px-[4rem]`}
    >
      <div className="w-full max-w-[87.5rem]">
        {/* Department Welcome Header */}
        <header className="flex justify-between items-center mb-[1.5rem]">
          <h1 className="text-[2rem] font-extrabold text-center uppercase text-[#1d3557] mb-1 tracking-wide">
            Welcome!{" "}
            <span className="bg-blue-100 p-3 rounded-md mb-4 text-center text-blue-700">
              {userData?.first_name || "No first name."}
            </span>
          </h1>
        </header>

        {/* Department Info Card */}
        <div className="bg-white shadow-lg rounded-[1.875rem] p-[1.5rem] mb-[1.5rem] flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={ProfileIcon}
              alt="Profile Icon"
              className="h-[5rem] w-[5rem] rounded-full mr-[1rem]"
            />
            <div>
              <h2 className="text-[1.25rem] font-semibold">
                {hasName
                  ? `${userData?.last_name || ""}, ${
                      userData?.first_name || ""
                    }`
                  : "No Name"}
              </h2>
              <p className="text-gray-600 text-[0.875rem]">
                <strong>Username:</strong>{" "}
                <em>{userData?.username || "No username."}</em>
              </p>
              <p className="text-gray-600 text-[0.875rem]">
                <strong>First joined:</strong>{" "}
                <em>
                  {new Date(userData?.date_joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) || "First joined not detected."}
                </em>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div>
              <span className="text-[1.125rem] font-semibold text-gray-700">
                Role:{" "}
              </span>
              <em>{userData?.groups?.join(", ")}</em>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-[1.875rem] p-[1.5rem] mb-[1.5rem] flex flex-wrap items-center justify-evenly gap-4">
          <EnrollmentDate />
        </div>

        {/* Stats and Pie Chart Section */}
        <div className="flex flex-col md:flex-row gap-[1rem] mb-[1.5rem] flex-wrap justify-center items-center">
          {/* Total Students Card */}
          <div className="bg-white shadow rounded-[1.875rem] p-6 text-center h-[21.5rem] w-full md:w-[48rem] lg:w-[14rem]">
            <img
              src={StudentIcon}
              alt="Total Students"
              className="h-[4rem] w-[4rem] mx-auto mb-[1rem]"
            />
            <h3 className="text-base font-medium text-gray-500">
              Total Students
            </h3>
            <p className="text-2xl font-bold mb-[1rem]">
              {dashboardData?.total_students || 0}
            </p>
            <hr className="border-t border-gray-300 mb-[1rem]" />
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-500">BSCS</p>
                <p className="text-xl font-bold">
                  {dashboardData?.bscs_students || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">BSIT</p>
                <p className="text-xl font-bold">
                  {dashboardData?.bsit_students || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Smaller Cards */}
          <div className="grid grid-cols-2 gap-[1rem] w-full md:w-full lg:w-auto justify-center items-center">
            <div className="bg-white shadow rounded-[1.875rem] p-6 text-center h-[10rem]">
              <img
                src={StudentIcon}
                alt="Regular Students"
                className="h-[3rem] w-[3rem] mx-auto mb-[0.5rem]"
              />
              <h3 className="text-sm font-medium text-gray-500">Regular</h3>
              <p className="text-xl font-bold">
                {dashboardData?.regular_students || 0}
              </p>
            </div>
            <div className="bg-white shadow rounded-[1.875rem] p-6 text-center h-[10rem]">
              <img
                src={IrregularIcon}
                alt="Irregular Students"
                className="h-[3rem] w-[3rem] mx-auto mb-[0.5rem]"
              />
              <h3 className="text-sm font-medium text-gray-500">Irregular</h3>
              <p className="text-xl font-bold">
                {dashboardData?.irregular_students || 0}
              </p>
            </div>
            <div className="bg-white shadow rounded-[1.875rem] p-6 text-center h-[10rem]">
              <img
                src={StudentIcon}
                alt="New Students"
                className="h-[3rem] w-[3rem] mx-auto mb-[0.5rem]"
              />
              <h3 className="text-sm font-medium text-gray-500">
                New Students
              </h3>
              <p className="text-xl font-bold">
                {dashboardData?.new_students || 0}
              </p>
            </div>
            <div className="bg-white shadow rounded-[1.875rem] p-6 text-center h-[10rem]">
              <img
                src={StudentIcon}
                alt="Transferee Students"
                className="h-[3rem] w-[3rem] mx-auto mb-[0.5rem]"
              />
              <h3 className="text-sm font-medium text-gray-500">Transferee</h3>
              <p className="text-xl font-bold">
                {dashboardData?.transferee_students || 0}
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow rounded-[1.875rem] p-6 text-center h-[21rem] w-full md:w-[48rem] lg:w-[30rem] flex flex-col items-center justify-center">
            <div className="h-[12rem] w-[12rem] md:h-[15rem] md:w-[15rem] lg:h-[18rem] lg:w-[18rem]">
              <Doughnut
                data={hasData ? pieData : noData}
                options={pieOptions}
              />
            </div>
            <div className="grid grid-cols-2 gap-[0.5rem] text-sm mt-4 text-center">
              <div className="flex items-center justify-center">
                <span className="h-[1rem] w-[1rem] bg-green-500 rounded-full mr-2"></span>
                Enrolled
              </div>
              <div className="flex items-center justify-center">
                <span className="h-[1rem] w-[1rem] bg-red-500 rounded-full mr-2"></span>
                Not Enrolled
              </div>
              <div className="flex items-center justify-center">
                <span className="h-[1rem] w-[1rem] bg-blue-500 rounded-full mr-2"></span>
                Waitlisted
              </div>
              <div className="flex items-center justify-center">
                <span className="h-[1rem] w-[1rem] bg-yellow-500 rounded-full mr-2"></span>
                Pending Request
              </div>
            </div>
          </div>
        </div>

        {/* Program Breakdown Section */}
        <div className="bg-white shadow-lg rounded-[1.875rem] p-6">
          {/* Top Section: Dropdown and Legend */}
          <div className="flex justify-between items-center mb-6">
            {/* Program Selector */}
            <div className="flex items-center gap-4">
              <label htmlFor="program" className="font-bold text-gray-800">
                PROGRAM
              </label>
              <select
                id="program"
                className="border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 w-[rem]"
                onChange={(e) => setProgram(e.target.value)}
              >
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
              </select>
            </div>

            {/* Legend */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                <p className="text-sm font-medium text-gray-700">1st Year</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                <p className="text-sm font-medium text-gray-700">2nd Year</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                <p className="text-sm font-medium text-gray-700">3rd Year</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <p className="text-sm font-medium text-gray-700">4th Year</p>
              </div>
            </div>
          </div>

          {/* Data Section */}
          <div className="grid grid-cols-5 gap-y-4 text-center md:grid-cols-5 lg:grid-cols-5">
            <p className="font-semibold text-gray-700 col-span-1">
              Number of Students
            </p>
            <div className="col-span-4 grid grid-cols-4 gap-4">
              <p className="text-lg font-medium text-gray-700">
                {program === "BSCS"
                  ? dashboardData?.bscs_first_year_students
                  : dashboardData?.bsit_first_year_students}
              </p>
              <p className="text-lg font-medium text-gray-700">
                {program === "BSCS"
                  ? dashboardData?.bscs_second_year_students
                  : dashboardData?.bsit_second_year_students}
              </p>
              <p className="text-lg font-medium text-gray-700">
                {program === "BSCS"
                  ? dashboardData?.bscs_third_year_students
                  : dashboardData?.bsit_third_year_students}
              </p>
              <p className="text-lg font-medium text-gray-700">
                {program === "BSCS"
                  ? dashboardData?.bscs_fourth_year_students
                  : dashboardData?.bsit_fourth_year_students}
              </p>
            </div>

            {/* Row 2: Student Bars */}
            <p className="font-semibold text-gray-700 col-span-1"></p>
            <div className="col-span-4 grid grid-cols-4 gap-4">
              <div className="h-2 bg-red-500 rounded-full"></div>
              <div className="h-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 bg-yellow-500 rounded-full"></div>
              <div className="h-2 bg-green-500 rounded-full"></div>
            </div>

            {/* Row 3: Number of Sections */}
            <p className="font-semibold text-gray-700 col-span-1">Sections</p>
            <div className="col-span-4 grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-gray-700">
                  {dashboardData?.bscs_section_1_students || 0}
                </p>
                <div className="h-2 bg-red-500 rounded-full w-full"></div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-gray-700">
                  {dashboardData?.bscs_section_2_students || 0}
                </p>
                <div className="h-2 bg-blue-500 rounded-full w-full"></div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-gray-700">
                  {dashboardData?.bscs_section_3_students || 0}
                </p>
                <div className="h-2 bg-yellow-500 rounded-full w-full"></div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-gray-700">
                  {dashboardData?.bscs_section_4_students || 0}
                </p>
                <div className="h-2 bg-green-500 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
